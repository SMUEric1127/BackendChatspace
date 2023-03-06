import { Repository } from 'typeorm';
import { Account } from '../entities/account';
export declare class UsersService {
    private accountRepository;
    constructor(accountRepository: Repository<Account>);
    findAll(): Promise<Account[]>;
    findOne(userId: string): Promise<Account>;
    findOnePO(phoneNumber: string): Promise<Account>;
    createUser(account: Account): Promise<Account>;
    getTokens(userId: string): Promise<number>;
}
