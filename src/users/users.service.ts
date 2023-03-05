import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async createUser(username: String, password: String): Promise<User> {
        const user = await this.getUser({ username, password })
        console.log(user)
        if (user) {
            throw new HttpException("User exist", HttpStatus.CREATED)
        }
        return this.userModel.create({
            username,
            password,
        });
    }

    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec()
    }

    async getUser({ username, password}): Promise<User | undefined> {
        return this.userModel.findOne({
            username,
        });
    }
}
