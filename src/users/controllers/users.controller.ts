import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Account } from '../entities/account';

import * as jwt from 'jsonwebtoken'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createAccount(@Res() response, @Body()account: Account) {
        const newAccount = await this.usersService.createUser(account);
        return response.status(HttpStatus.CREATED).json({
            newAccount
        })
    }

    @Get()
    async fetchAll(@Res() response) {
        const accounts = await this.usersService.findAll();
        return response.status(HttpStatus.OK).json({
            accounts
        })
    }

    @Post('tokens/:userId')
    async findByUserId(@Res() response, @Param('userId') userId, @Body() body: any) {
        // Verify the sessionId to see if it's valid first
        let returnString = "Something went wrong"
        try {
            const decoded = JSON.parse(JSON.stringify(jwt.verify(body.sessionId, global.secretMasterSecretKey)));
            console.log(decoded.userId, ' - ', userId)
            console.log("Current date: ", new Date().toISOString(), " iat: ", decoded.iat)
            const expiredIn = Math.floor(Date.now() / 1000) - parseFloat(decoded.iat) 
            if (expiredIn > global.expiredSeconds) {
                throw new HttpException("Expired token", HttpStatus.UNAUTHORIZED)
            } else {
                console.log("Token expired in: ", global.expiredSeconds - expiredIn)
            }
            if (decoded.userId !== userId) {
                console.log("Asking for different account that is not yours")
                throw new HttpException('No permission', HttpStatus.FORBIDDEN)
            }
            // TODO: Add verify the timestamp and request new one
            returnString = JSON.parse(JSON.stringify(await this.usersService.findOne(userId))).totalTokens
        } catch (err) {
            console.log(err.message)
            if (err.message === "invalid signature") {
                throw new HttpException("Invalid signature", HttpStatus.UNAUTHORIZED)
            }
            else {
                throw new HttpException(err.response, err.status)
            }
        }

        return response.status(HttpStatus.OK).json({returnString})
    }
}
