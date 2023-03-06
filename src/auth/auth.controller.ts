import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

const dotenv = require('dotenv')
dotenv.config()

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService) { }

    // @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(
        @Body('username') username: String,
        @Body('password') password: String,
        ) {
        return this.authServices.loginWithCredentials(username, password);
    }
}
