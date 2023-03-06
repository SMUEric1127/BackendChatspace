import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Body, Headers } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Configuration, OpenAIApi } from 'openai';
import { ServiceService } from './service.service';

const { v4: uuidv4 } = require('uuid');

const dotenv = require('dotenv')
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})
const openai = new OpenAIApi(configuration);

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getHello(@Headers() headers): string {
        this.serviceService.getUsernameFromHeader(headers)
        return "Welcome to Services API";
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/prompt')
    async genResponse(
        @Body('prompt') prompt: string,
        @Headers() headers
    ) {
        // Generate status code
        const status = uuidv4();

        // Don't need to await this because now we'll return the status code
        var response = openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: Number(process.env.MAX_TOKENS),
            messages: [{ role: "user", content: `rule: response under ${process.env.MAX_TOKENS} tokens \n` + prompt }],
        });
        response.then(async (response) => {
            // Completed, print out the response
            // console.log(response.data)
            // console.log(response.data.choices[0].message["content"]);
            console.log("Done processing, total tokens: ", response.data.usage["total_tokens"])

            // Completed, update the data
            await this.serviceService.updateStatus(status, response.data.choices[0].message["content"], response.data.usage["total_tokens"])
            console.log("Posted to MongoDB")
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.status)
                console.log(error.response.data);
            }
        })

        // Create a new prompt at current user directory
        // Get the username
        const username = await this.serviceService.getUsernameFromHeader(headers)

        // Append the prompt
        this.serviceService.appendPrompt(status, username);

        // Return the status code to the user to poll every 1 seconds
        return status;
    }

    @Get('/prompt')
    async getResponseFromStatus(
        @Body('status') status: string
    ) {
        return await this.serviceService.getResponseFromStatus(status)
    }
}
