import { Injectable, MisdirectedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUserCredentials(username: String, password: String): Promise<any> {
        const user = await this.usersService.getUser({ username, password })
        return user ?? null;
    }

    async loginWithCredentials(user: any) {
        const payload = { username: user.username };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async renewCredentials(token: string) {
        try {
            // Verify the token
            console.log("TOKEN:", token)
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log("Not expired yet")
            throw new UnauthorizedException()
        } catch (error) {
            console.log(error.name)
            if (error.name == "TokenExpiredError") {
                console.log("IS EXPIRED")
                const decoded = jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true }) as any;

                const payload = { username: decoded.username }
                return {
                    access_token: this.jwtService.sign(payload)
                };
            } else {
                console.log("Not expired yet")
                throw new UnauthorizedException()
            }
        }
    }
}
