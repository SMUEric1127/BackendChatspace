import { UsersService } from './users.service';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    createUser(username: String, password: String): Promise<import("./users.model").User>;
    getAllUsers(): Promise<import("./users.model").User[]>;
}
