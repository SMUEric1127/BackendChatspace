import { Model } from 'mongoose';
import { User } from './users.model';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<User>);
    createUser(username: String, password: String): Promise<User>;
    getUsers(): Promise<User[]>;
    getUser({ username, password }: {
        username: any;
        password: any;
    }): Promise<User | undefined>;
}
