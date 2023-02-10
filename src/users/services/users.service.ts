import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Account } from '../entities/account';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>
    ){}

    findAll(): Promise<Account[]> {
        return this.accountRepository.find();
    }

    findOne(userId: string): Promise<Account> {
        return this.accountRepository.findOne({
            where: { userId: userId }
        })
    }

    findOnePO(phoneNumber: string): Promise<Account> {
        return this.accountRepository.findOne({
            where: { phoneNumber: phoneNumber }
        })
    }

    async createUser(account: Account): Promise<Account> {
        console.log("CREATING USER")
        const findAccount = await this.findOne(account.userId) == null
        if (await this.findOne(account.userId) == null && await this.findOnePO(account.phoneNumber)  == null) {
            // automatically increase the id
            return this.accountRepository.save(account)
        }
        const acc = await this.findOnePO(account.phoneNumber);
        console.log(await this.findOne(account.userId))
        console.log(await this.findOnePO(account.phoneNumber))
        return acc;
    }

    async getTokens(userId: string) {
        return (await this.findOne(userId)).totalTokens;
    }
}
