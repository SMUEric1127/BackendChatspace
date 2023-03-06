import { SessionManagerService } from '../services/session-manager.service';
export declare class SessionManagerController {
    private readonly sessionService;
    constructor(sessionService: SessionManagerService);
    test(): Promise<string>;
    authenticate(response: any, body: any): Promise<any>;
    getResponseDirect(response: any, body: any): Promise<any>;
    getResponse(response: any, body: any): Promise<any>;
}
