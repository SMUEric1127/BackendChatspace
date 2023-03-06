import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUserCredentials(username: String, password: String): Promise<any>;
    loginWithCredentials(username: any, password: any): Promise<{
        statusCode: number;
        message: string;
        access_token?: undefined;
    } | {
        access_token: string;
        statusCode?: undefined;
        message?: undefined;
    }>;
}
