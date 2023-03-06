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
        console.log("FINDING: ", username, password)
        const user = await this.usersService.getUser({ username, password })
        return user ?? null;
    }

    async loginWithCredentials(username, password) {
        const userReturn = await this.validateUserCredentials(username, password);
        if (userReturn == null) {
            return {
                "statusCode": 500,
                "message": "Invalid username or password"
              }
        }

        const payload = { username: username };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
