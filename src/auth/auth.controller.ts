import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

const dotenv = require('dotenv')
dotenv.config()

@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authServices.loginWithCredentials(req.user);
    }

    @Post('handshake')
    async handshake(@Request() req) {
        const token = req.headers.authorization.split(' ')[1]
        return this.authServices.renewCredentials(token);
    }
}
