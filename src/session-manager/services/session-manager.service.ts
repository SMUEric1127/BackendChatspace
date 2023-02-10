import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Account, Prompt } from 'src/users/entities/account';

import * as jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/services/users.service';

const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv')
dotenv.config()

global.expiredSeconds = process.env.EXPIRED_SECONDS
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

@Injectable()
export class SessionManagerService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private userService: UsersService,
        @InjectRepository(Prompt)
        private promptRepository: Repository<Prompt>,
    ){}

    createSessionId() {
        return uuidv4();
    }

    async handshake(body: any) {
        // Verify if userId is exist
        console.log(body)
        var sessionId = "";
        if (typeof(body.userId) == "undefined") {
            console.log("undefined")
            throw new HttpException('No account found', HttpStatus.UNAUTHORIZED)
        }
        const existingAccount = await this.userService.findOne(body.userId);
        if (!existingAccount) {
            throw new HttpException('No account found', HttpStatus.UNAUTHORIZED)
        }
        if (existingAccount.sessionId != "" && body.renew == "false") {
            console.log("RETURNING CURRENT SESSION ID")
            sessionId = existingAccount.sessionId
        } else {
            console.log("GENERATE NEW SESSION ID")
            const userId = body.userId;
            const jwtPayload = { userId };
            const secretKey = global.secretMasterSecretKey;
            console.log(`Signed with: ${userId} - ${secretKey}`)
            sessionId = jwt.sign(jwtPayload, secretKey);

            existingAccount.sessionId = sessionId;
            await this.accountRepository.save(existingAccount);

            // const decoded = JSON.parse(JSON.stringify(jwt.verify(sessionId, global.secretMasterSecretKey)));
        }
        return { sessionId };
    }

    async sendPrompt(prompt: string): Promise<string[]> {
        const response = await openai.createCompletion({
            model: process.env.MODEL,
            prompt: `AI: How can I help you? Human: ${prompt} ?`,
            temperature: parseFloat(process.env.TEMPERATURE),
            max_tokens: parseFloat(process.env.MAX_TOKENS),
            top_p: parseFloat(process.env.TOP_P),
            frequency_penalty: parseFloat(process.env.FREQ_PENALTY),
            presence_penalty: parseFloat(process.env.PRES_PENALTY),
        })
        // console.log(response["data"]["usage"]["total_tokens"])
        const choice = response["data"]["choices"]
        const usage = response["data"]["usage"]
        console.log(usage)

        const array: string[] = [];
        const reply = choice[0]["text"].replace(/\n\n/g, "").replace("AI:","").replace("AI","");
        array.push(reply);
        array.push(usage["prompt_tokens"], usage["completion_tokens"], usage["total_tokens"]);
        return array;
    }

    async appendPrompt(@Body() body: any, resp: string[], decoded: any){
        // Retrieve user from decoded.uuid
        const userId = JSON.parse(JSON.stringify(decoded)).userId
        const account = await this.userService.findOne(userId)

        // Create the prompt
        const prompt = new Prompt();
        prompt.sessionId = body.sessionId;
        prompt.prompt = body.prompt;
        prompt.response = resp[0];
        console.log(parseInt(resp[1]))
        prompt.promptTokens = parseInt(resp[1]);
        prompt.completionTokens = parseInt(resp[2]);
        prompt.totalTokens = parseInt(resp[3]);

        // Link with the user
        prompt.account = account;

        // Update total tokens of the user
        account.totalTokens = account.totalTokens + prompt.totalTokens

        // Save the prompt and update the user
        await this.accountRepository.save(account);
        const promptSaved = await this.promptRepository.save(prompt);
        console.log("Append prompt: " + promptSaved);
    }

    async getResponse(@Body() body: any) {
        // Check the sessionId in here
        let returnString = "Something went wrong"
        try {
            const decoded = JSON.parse(JSON.stringify(jwt.verify(body.sessionId, global.secretMasterSecretKey)));

            console.log("Current date: ", new Date().toISOString(), " iat: ", decoded.iat)
            const expiredIn = Math.floor(Date.now() / 1000) - parseFloat(decoded.iat) 
            if (expiredIn > global.expiredSeconds) {
                throw new HttpException("Expired token", HttpStatus.UNAUTHORIZED)
            } else {
                console.log("Token expired in: ", global.expiredSeconds - expiredIn)
            }
            
            console.log("Prompt: " + body.prompt);
            const resp = await this.sendPrompt(body.prompt);
            returnString = resp[0]

            // Save new prompt to the user
            console.log("Appending new prompt")
            await this.appendPrompt(body, resp, decoded)
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new HttpException("Expired Token rehandshake", HttpStatus.UNAUTHORIZED)
            } else {
                console.log(err)
                throw new HttpException("Cant verify, probably wrong token", HttpStatus.UNAUTHORIZED)
            }
        }
        return { returnString };
    }
}