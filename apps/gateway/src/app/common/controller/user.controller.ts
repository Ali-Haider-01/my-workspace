import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  Auth,
  ChangePasswordDto,
  EmailDto,
  ForgotPasswordDto,
  LogInDto,
  MESSAGE_PATTERNS,
  RefreshTokenDto,
  SERVICES,
  UserDto,
} from '@workspace/shared';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const {
  SIGN_UP,
  LOG_IN,
  GENERATE_OTP,
  FORGOT_PASSWORD,
  REFRESH_TOKEN,
  GET_PROFILE,
  CHANGE_PASSWORD,
  LOG_OUT,
} = MESSAGE_PATTERNS.USER;

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject(SERVICES.USER) private readonly userClient: ClientRMQ) {}

  @Post('/signUp')
  async signUp(@Body() userDto: UserDto) {
    try {
      return await firstValueFrom(this.userClient.send(SIGN_UP, userDto));
    } catch (error) {
      console.error('Gateway signUp error:', error);
      throw error;
    }
  }

  @Post('/logIn')
  async logIn(@Body() loginDto: LogInDto) {
    try {
      return await firstValueFrom(this.userClient.send(LOG_IN, loginDto));
    } catch (error) {
      console.error('Gateway login error:', error);
      throw error;
    }
  }

  @Post('/generate-otp')
  async generateOTP(@Body() emailDto: EmailDto) {
    try {
      return await firstValueFrom(this.userClient.send(GENERATE_OTP, emailDto));
    } catch (error) {
      console.error('Gateway generateOTP error:', error);
      throw error;
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    try {
      return await firstValueFrom(
        this.userClient.send(FORGOT_PASSWORD, forgotPassword)
      );
    } catch (error) {
      console.error('Gateway forgotPassword error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return await firstValueFrom(
        this.userClient.send(REFRESH_TOKEN, refreshTokenDto)
      );
    } catch (error) {
      console.error('Gateway refreshToken error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Get('/get-profile')
  async getProfile(@Request() req) {
    try {
      console.log(req.user,"1");
      return await firstValueFrom(this.userClient.send(GET_PROFILE, req.user));
    } catch (error) {
      console.error('Gateway getProfile error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Patch('/change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    try {
      return await firstValueFrom(
        this.userClient.send(CHANGE_PASSWORD, {
          email: req.user.email,
          changePasswordDto,
        })
      );
    } catch (error) {
      console.error('Gateway changePassword error:', error);
      throw error;
    }
  }

  @ApiBearerAuth()
  @Auth()
  @Patch('/logOut')
  async logOut(@Request() req) {
    try {
      return await firstValueFrom(this.userClient.send(LOG_OUT, req.user.email));
    } catch (error) {
      console.error('Gateway logOut error:', error);
      throw error;
    }
  }
}
