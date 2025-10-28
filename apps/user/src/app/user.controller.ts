import {
  Controller,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  EmailDto,
  ForgotPasswordDto,
  LogInDto,
  MESSAGE_PATTERNS,
  RefreshTokenDto,
  UserDto,
} from '@workspace/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';

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

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @MessagePattern(SIGN_UP)
  signUp(userDto: UserDto) {
    return this.userService.signUp(userDto);
  }

  @MessagePattern(LOG_IN)
  logIn(loginDto: LogInDto) {
    return this.userService.logIn(loginDto);
  }

  @MessagePattern(GENERATE_OTP)
  generateOTP(emailDto: EmailDto) {
    return this.userService.generateOTP(emailDto);
  }

  @MessagePattern(FORGOT_PASSWORD)
  forgotPassword(forgotPassword: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPassword);
  }

  @MessagePattern(REFRESH_TOKEN)
  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @MessagePattern(GET_PROFILE)
  getProfile(@Payload() payload) {
    return this.userService.userProfile(payload);
  }

  @MessagePattern(CHANGE_PASSWORD)
  changePassword(data: { email: string; changePasswordDto: ChangePasswordDto }) {
    return this.userService.changePassword(data.email, data.changePasswordDto);
  }

  @MessagePattern(LOG_OUT)
  logOut(email: string) {
    return this.userService.logOut(email);
  }
}
