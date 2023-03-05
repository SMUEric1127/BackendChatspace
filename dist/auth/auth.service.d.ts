import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUserCredentials(username: String, password: String): Promise<any>;
    loginWithCredentials(user: any): Promise<{
        access_token: string;
    }>;
    renewCredentials(token: string): Promise<{
        access_token: string;
    }>;
}
