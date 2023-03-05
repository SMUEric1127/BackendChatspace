import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authServices;
    constructor(authServices: AuthService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    handshake(req: any): Promise<{
        access_token: string;
    }>;
}
