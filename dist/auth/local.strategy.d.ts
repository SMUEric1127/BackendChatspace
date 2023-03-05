import { AuthService } from "./auth.service";
declare const LocalStrategy_base: new (...args: any[]) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authSerice;
    constructor(authSerice: AuthService);
    validate(username: String, password: String): Promise<any>;
}
export {};
