import { Repository } from 'typeorm';
import { Account, Prompt } from 'src/users/entities/account';
import { UsersService } from 'src/users/services/users.service';
export declare class SessionManagerService {
    private accountRepository;
    private userService;
    private promptRepository;
    constructor(accountRepository: Repository<Account>, userService: UsersService, promptRepository: Repository<Prompt>);
    createSessionId(): any;
    handshake(body: any): Promise<{
        sessionId: string;
    }>;
    sendPrompt(prompt: string): Promise<string[]>;
    appendPrompt(body: any, resp: string[], decoded: any): Promise<void>;
    getResponseDirect(body: any): Promise<string>;
    getResponse(body: any): Promise<{
        returnString: string;
    }>;
}
