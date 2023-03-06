"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManagerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_1 = require("../../users/entities/account");
const jwt = require("jsonwebtoken");
const uuid_1 = require("uuid");
const users_service_1 = require("../../users/services/users.service");
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config();
global.expiredSeconds = process.env.EXPIRED_SECONDS;
const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
let SessionManagerService = class SessionManagerService {
    constructor(accountRepository, userService, promptRepository) {
        this.accountRepository = accountRepository;
        this.userService = userService;
        this.promptRepository = promptRepository;
    }
    createSessionId() {
        return (0, uuid_1.v4)();
    }
    async handshake(body) {
        console.log(body);
        var sessionId = "";
        if (typeof (body.userId) == "undefined") {
            console.log("undefined");
            throw new common_1.HttpException('No account found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const existingAccount = await this.userService.findOne(body.userId);
        if (!existingAccount) {
            throw new common_1.HttpException('No account found', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (existingAccount.sessionId != "" && body.renew == "false") {
            console.log("RETURNING CURRENT SESSION ID");
            sessionId = existingAccount.sessionId;
        }
        else {
            console.log("GENERATE NEW SESSION ID");
            const userId = body.userId;
            const jwtPayload = { userId };
            const secretKey = global.secretMasterSecretKey;
            console.log(`Signed with: ${userId} - ${secretKey}`);
            sessionId = jwt.sign(jwtPayload, secretKey);
            existingAccount.sessionId = sessionId;
            await this.accountRepository.save(existingAccount);
        }
        return { sessionId };
    }
    async sendPrompt(prompt) {
        const response = await openai.createCompletion({
            model: process.env.MODEL,
            messages: [{ "role": "user", "content": prompt }],
        });
        const choice = response["data"]["choices"];
        const usage = response["data"]["usage"];
        console.log(usage);
        const array = [];
        const reply = choice[0]["message"].replace(/\n\n/g, "").replace("AI:", "").replace("AI", "");
        array.push(reply);
        array.push(usage["prompt_tokens"], usage["completion_tokens"], usage["total_tokens"]);
        return array;
    }
    async appendPrompt(body, resp, decoded) {
        const userId = JSON.parse(JSON.stringify(decoded)).userId;
        const account = await this.userService.findOne(userId);
        const prompt = new account_1.Prompt();
        prompt.sessionId = body.sessionId;
        prompt.prompt = body.prompt;
        prompt.response = resp[0];
        console.log(parseInt(resp[1]));
        prompt.promptTokens = parseInt(resp[1]);
        prompt.completionTokens = parseInt(resp[2]);
        prompt.totalTokens = parseInt(resp[3]);
        prompt.account = account;
        account.totalTokens = account.totalTokens + prompt.totalTokens;
        await this.accountRepository.save(account);
        const promptSaved = await this.promptRepository.save(prompt);
        console.log("Append prompt: " + promptSaved);
    }
    async getResponseDirect(body) {
        const resp = await this.sendPrompt(body.prompt);
        const returnString = resp[0];
        return returnString;
    }
    async getResponse(body) {
        let returnString = "Something went wrong";
        try {
            const decoded = JSON.parse(JSON.stringify(jwt.verify(body.sessionId, global.secretMasterSecretKey)));
            console.log("Current date: ", new Date().toISOString(), " iat: ", decoded.iat);
            const expiredIn = Math.floor(Date.now() / 1000) - parseFloat(decoded.iat);
            if (expiredIn > global.expiredSeconds) {
                throw new common_1.HttpException("Expired token", common_1.HttpStatus.UNAUTHORIZED);
            }
            else {
                console.log("Token expired in: ", global.expiredSeconds - expiredIn);
            }
            console.log("Prompt: " + body.prompt);
            const resp = await this.sendPrompt(body.prompt);
            returnString = resp[0];
            console.log("Appending new prompt");
            await this.appendPrompt(body, resp, decoded);
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new common_1.HttpException("Expired Token rehandshake", common_1.HttpStatus.UNAUTHORIZED);
            }
            else {
                console.log(err);
                throw new common_1.HttpException("Cant verify, probably wrong token", common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        return { returnString };
    }
};
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, Object]),
    __metadata("design:returntype", Promise)
], SessionManagerService.prototype, "appendPrompt", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionManagerService.prototype, "getResponseDirect", null);
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionManagerService.prototype, "getResponse", null);
SessionManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_1.Account)),
    __param(2, (0, typeorm_1.InjectRepository)(account_1.Prompt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        typeorm_2.Repository])
], SessionManagerService);
exports.SessionManagerService = SessionManagerService;
//# sourceMappingURL=session-manager.service.js.map