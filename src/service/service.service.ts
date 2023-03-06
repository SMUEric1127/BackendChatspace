import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt } from './prompt.model'

import * as jwt from 'jsonwebtoken'

@Injectable()
export class ServiceService {
    constructor(@InjectModel('Prompt') private readonly promptModel: Model<Prompt>) { }

    private async extractBearerToken(header: any) {
        const token = header.authorization.split(' ')[1];
        return token
    }

    async getUsernameFromHeader(header: any) {
        // Get the Token
        const token = await this.extractBearerToken(header)

        // Get the username
        const decoded = JSON.parse(JSON.stringify(jwt.verify(token, process.env.SECRET_KEY)));
        console.log("Token: ", token, " - Username: ", decoded.username)
        return decoded.username
    }

    async getResponseFromStatus(status: string) {
        return await this.promptModel.find({
            status
        })
    }

    async updateStatus(status: string, response: string, tokens: number) {
        response = response.replace(/\n/g, "")
        return await this.promptModel.findOneAndUpdate({
            status
        }, { $set: {
                response: response,
                tokens: tokens
            }
        })
    }

    async appendPrompt(status: string, username: string) {
        return this.promptModel.create({
            status,
            username,
        });
    }
}
