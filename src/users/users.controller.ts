import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt'

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    async createUser(
        @Body('username') username: String,
        @Body('password') password: String,
    ) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return this.userService.createUser(username, hashedPassword);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllUsers() {
        return this.userService.getUsers();
    }
}
