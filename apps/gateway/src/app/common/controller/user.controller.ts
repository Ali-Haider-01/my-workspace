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
    return await firstValueFrom(this.userClient.send(SIGN_UP, userDto));
  }

  @Post('/logIn')
  async logIn(@Body() loginDto: LogInDto) {
    return await firstValueFrom(this.userClient.send(LOG_IN, loginDto));
  }

  @Post('/generate-otp')
  async generateOTP(@Body() emailDto: EmailDto) {
    return await firstValueFrom(this.userClient.send(GENERATE_OTP, emailDto));
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return await firstValueFrom(
      this.userClient.send(FORGOT_PASSWORD, forgotPassword)
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await firstValueFrom(
      this.userClient.send(REFRESH_TOKEN, refreshTokenDto)
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/get-profile')
  async getProfile(@Request() req) {
    return await firstValueFrom(this.userClient.send(GET_PROFILE, req.user));
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return await firstValueFrom(
      this.userClient.send(CHANGE_PASSWORD, {
        email: req.user.email,
        changePasswordDto,
      })
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/logOut')
  async logOut(@Request() req) {
    return await firstValueFrom(this.userClient.send(LOG_OUT, req.user.email));
  }
}
