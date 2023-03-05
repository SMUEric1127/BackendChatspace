import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Configuration, OpenAIApi } from 'openai';

const dotenv = require('dotenv')
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})
const openai = new OpenAIApi(configuration);

@Controller('service')
export class ServiceController {
    @UseGuards(AuthGuard('jwt'))
    @Get()
    getHello(): string {
        return "Service API";
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('gen')
    async genImage() {
        var image_url;
        try {
            const response = await openai.createImage({
                prompt: "a white siamese cat",
                n: 1,
                size: "256x256",
            });
            image_url = response.data.data[0].url;
            console.log(image_url)
        } catch (error) {
            if (error.response) {
                console.log(error.response.status)
                console.log(error.response.data);
            }
        }
        return image_url;
    }
}
