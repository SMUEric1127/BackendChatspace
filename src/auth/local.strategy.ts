import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Strategy } from "passport-local"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authSerice: AuthService) { super(); }

    async validate(username: String, password: String): Promise<any> {
        const user = await this.authSerice.validateUserCredentials(
            username,
            password,
        );
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}