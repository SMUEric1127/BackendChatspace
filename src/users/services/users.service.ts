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
            where: { userId: userId}
        })
    }

    async createUser(account: Account): Promise<Account> {
        if (await this.findOne(account.userId) || await this.findOne(account.phoneNumber)) {
            throw new HttpException('Account already exists', HttpStatus.CONFLICT)
        }

        // automatically increase the id
        return this.accountRepository.save(account)
    }

    async getTokens(userId: string) {
        return (await this.findOne(userId)).totalTokens;
    }
}
