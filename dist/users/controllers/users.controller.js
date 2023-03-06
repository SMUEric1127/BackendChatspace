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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../services/users.service");
const account_1 = require("../entities/account");
const jwt = require("jsonwebtoken");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createAccount(response, account) {
        const newAccount = await this.usersService.createUser(account);
        return response.status(common_1.HttpStatus.CREATED).json({
            newAccount
        });
    }
    async fetchAll(response) {
        const accounts = await this.usersService.findAll();
        return response.status(common_1.HttpStatus.OK).json({
            accounts
        });
    }
    async findByUserId(response, userId, body) {
        let returnString = "Something went wrong";
        try {
            const decoded = JSON.parse(JSON.stringify(jwt.verify(body.sessionId, global.secretMasterSecretKey)));
            console.log(decoded.userId, ' - ', userId);
            console.log("Current date: ", new Date().toISOString(), " iat: ", decoded.iat);
            const expiredIn = Math.floor(Date.now() / 1000) - parseFloat(decoded.iat);
            if (expiredIn > global.expiredSeconds) {
                throw new common_1.HttpException("Expired token", common_1.HttpStatus.UNAUTHORIZED);
            }
            else {
                console.log("Token expired in: ", global.expiredSeconds - expiredIn);
            }
            if (decoded.userId !== userId) {
                console.log("Asking for different account that is not yours");
                throw new common_1.HttpException('No permission', common_1.HttpStatus.FORBIDDEN);
            }
            returnString = JSON.parse(JSON.stringify(await this.usersService.findOne(userId))).totalTokens;
            console.log("Finding: ", userId, " got: ", JSON.parse(JSON.stringify(await this.usersService.findOne(userId))).totalTokens);
        }
        catch (err) {
            console.log(err.message);
            if (err.message === "invalid signature") {
                throw new common_1.HttpException("Invalid signature", common_1.HttpStatus.UNAUTHORIZED);
            }
            else {
                throw new common_1.HttpException(err.response, err.status);
            }
        }
        return response.status(common_1.HttpStatus.OK).json({ returnString });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, account_1.Account]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAccount", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "fetchAll", null);
__decorate([
    (0, common_1.Post)('tokens/:userId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findByUserId", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map