import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { response } from 'express';
import { stringify } from 'querystring';
import { Account } from 'src/users/entities/account';
import { SessionManagerService } from '../services/session-manager.service';

@Controller('session-manager')
export class SessionManagerController {
    constructor(private readonly sessionService: SessionManagerService) {}

    @Get()
    async authenticate(@Res() response, @Body() account: Account) {
        const sessionId = await this.sessionService.handshake(account);
        return response.status(HttpStatus.OK).json(sessionId)
    }

    @Post()
    async getResponse(@Res() response, @Body() body: any) {
        const responseString = await this.sessionService.getResponse(body);
        return response.status(HttpStatus.OK).json(responseString)
    }

    // @Post('test')
    // async testHello(@Res() response, @Body() body: any) {
    //     const responseString = await this.sessionService.sendPrompt(body.prompt)
    //     return response.status(HttpStatus.OK).json(responseString[0])
    // }
}
