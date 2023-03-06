import { UsersService } from '../services/users.service';
import { Account } from '../entities/account';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createAccount(response: any, account: Account): Promise<any>;
    fetchAll(response: any): Promise<any>;
    findByUserId(response: any, userId: any, body: any): Promise<any>;
}
