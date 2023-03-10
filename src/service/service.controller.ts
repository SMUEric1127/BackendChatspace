import { Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Body, Headers, Ip, Param, Query, Req } from '@nestjs/common/decorators/http/route-params.decorator';
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
        return "Welcome to Services Backend API";
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/prompt')
    async genResponse(
        @Body('prompt') prompt: string,
        @Headers() headers
    ) {
        // Generate status code
        const status = uuidv4();
        console.log("Prompt: ", prompt)
        // Don't need to await this because now we'll return the status code
        var response = openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: Number(process.env.MAX_TOKENS),
            messages: [{ role: "user", content: "Answer under " + ProcessingInstruction.env.MAX_TOKENS + " tokens\n " + prompt}],
        });
        response.then(async (response) => {
            // Completed, print out the response
            // console.log(response.data)
            console.log(response.data.choices[0].message["content"]);
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
        return {status};
    }

    @Get('/prompt')
    async getResponseFromStatus(@Query('status') status: string, @Req() request) {
        console.log("Retrieving: ", status, " - from IP: ", request.ip)
        const prompt = await this.serviceService.getResponseFromStatus(status)
        const response = prompt[0]["response"]
        if (response) {
            return {
                statusCode: HttpStatus.ACCEPTED,
                response: response
            }
        } else {
            return {
                statusCode: HttpStatus.NO_CONTENT,
                response: "Please wait"
            }
        }
    }
}
