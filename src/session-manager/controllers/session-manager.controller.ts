import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { response } from 'express';
import { stringify } from 'querystring';
import { Account } from 'src/users/entities/account';
import { SessionManagerService } from '../services/session-manager.service';

@Controller('session-manager')
export class SessionManagerController {
    constructor(private readonly sessionService: SessionManagerService) {}
    
    @Get()
    async test() {
        return "OK"
    }

    @Get('handshake') 
    async testHand() {
        return "OK HANDSHAKE"
    }

    @Post('handshake')
    async authenticate(@Res() response, @Body() body: any) {
        const sessionId = await this.sessionService.handshake(body);
        return response.status(HttpStatus.OK).json(sessionId)
    }

    @Post('prompt')
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
