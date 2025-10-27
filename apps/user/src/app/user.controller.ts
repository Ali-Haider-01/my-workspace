import {
  Body,
  Controller,
  Request,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

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
  signUp(@Body() userDto: UserDto) {
    return this.userService.signUp(userDto);
  }

  @MessagePattern(LOG_IN)
  logIn(@Body() loginDto: LogInDto) {
    return this.userService.logIn(loginDto);
  }

  @MessagePattern(GENERATE_OTP)
  generateOTP(@Body() emailDto: EmailDto) {
    return this.userService.generateOTP(emailDto);
  }

  @MessagePattern(FORGOT_PASSWORD)
  forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPassword);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @MessagePattern(REFRESH_TOKEN)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @MessagePattern(GET_PROFILE)
  getProfile(@Request() req) {
    return this.userService.userProfile(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @MessagePattern(CHANGE_PASSWORD)
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user.email, changePasswordDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @MessagePattern(LOG_OUT)
  logOut(@Request() req) {
    return this.userService.logOut(req.user.email);
  }
}
