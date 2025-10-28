import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@workspace/shared';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  EmailDto,
  LogInDto,
  UserDto,
  RefreshTokenDto,
} from '@workspace/shared';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: UserDto) {
    const hash = await bcrypt.hash(userDto.password, 10);
    const user = new this.userModel({
      name: userDto.name,
      phoneNumber: userDto.phoneNumber,
      email: userDto.email,
      password: hash,
    });
    return user.save();
  }

  async userProfile(req: any) {
    const user = await this.userModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(req.userId),
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          phoneNumber: 1,
          email: 1,
        },
      },
    ]);
    if (!user || user.length === 0) {
      throw new NotFoundException('User not found');
    }
    return { user };
  }

  async generateOTP(emailDto: EmailDto) {
    const user = await this.userModel.findOne({ email: emailDto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10),
    ).join('');
    user.otp = otp;
    user.otpGenerateTime = Date.now();
    await user.save();
    return { message: 'OTP Generated' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user?.otp) {
      throw new NotFoundException('OTP not found in this user');
    }
    if (forgotPasswordDto.otp !== user.otp) {
      throw new BadRequestException('OTP not match');
    }

    const ONE_MINUTE = 1 * 60 * 1000;
    const now = Date.now();

    if (!user.otpGenerateTime || now - user.otpGenerateTime > ONE_MINUTE) {
      throw new BadRequestException('OTP Expired');
    }
    const hashNewPassword = await bcrypt.hash(
      forgotPasswordDto.newPassword,
      10,
    );
    user.password = hashNewPassword;
    user.otp = undefined;
    user.otpGenerateTime = undefined;
    await user.save();
    return { message: 'New password generated successfully' };
  }

  async logIn(logInDto: LogInDto) {
    try {
      const user = await this.userModel.findOne({ email: logInDto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      const isMatch = await bcrypt.compare(logInDto.password, user?.password);
      if (!isMatch) {
        throw new UnauthorizedException('password is incorrect');
      }
      
      const access_token = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '15m' },
      );
      const refresh_token = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '7d' },
      );
      
      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
      const hashedAccessToken = await bcrypt.hash(access_token, 10);
      
      user.refreshToken = hashedRefreshToken;
      user.accessToken = hashedAccessToken;
      await user.save();
      
      return { access_token, refresh_token };
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Log unexpected errors and throw generic error
      console.error('Login error:', error);
      throw new BadRequestException('Login failed due to server error');
    }
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user?.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const hashNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );
    user.password = hashNewPassword;
    await user.save();
    return { message: 'Password updated successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.token);
      const user = await this.userModel.findOne({ email: payload.email });
      if (!user || !user.refreshToken) throw new UnauthorizedException();

      const isMatch = await bcrypt.compare(
        refreshTokenDto.token,
        user.refreshToken,
      );
      if (!isMatch) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign(
        { email: user.email, userId: user._id },
        { expiresIn: '15m' },
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logOut(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException();
    user.refreshToken = undefined;
    user.accessToken = undefined;
    await user.save();
    return { message: 'Logged out successfully' };
  }
}
