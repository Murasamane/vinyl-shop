import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './guards/google.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeController,
} from '@nestjs/swagger';

@ApiExcludeController()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google login' })
  @ApiResponse({
    status: 200,
    description: 'Google login initiated successfully.',
  })
  handleLogin() {
    return { msg: 'Google Authenticated' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Handle Google authentication redirect' })
  @ApiResponse({
    status: 200,
    description: 'Google login redirect handled successfully.',
  })
  handleRedirect(@Req() req: Request) {
    return { msg: 'OK', request: req.user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  logout(@Req() req: Request) {
    req.logOut(() => {});
    return { msg: 'Logged out' };
  }
}
