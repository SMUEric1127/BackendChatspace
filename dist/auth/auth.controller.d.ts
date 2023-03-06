import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authServices;
    constructor(authServices: AuthService);
    login(username: String, password: String): Promise<{
        statusCode: number;
        message: string;
        access_token?: undefined;
    } | {
        access_token: string;
        statusCode?: undefined;
        message?: undefined;
    }>;
}
