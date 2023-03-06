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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_1 = require("../entities/account");
let UsersService = class UsersService {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    findAll() {
        return this.accountRepository.find();
    }
    findOne(userId) {
        return this.accountRepository.findOne({
            where: { userId: userId }
        });
    }
    findOnePO(phoneNumber) {
        return this.accountRepository.findOne({
            where: { phoneNumber: phoneNumber }
        });
    }
    async createUser(account) {
        console.log("CREATING USER");
        const findAccount = await this.findOne(account.userId) == null;
        if (await this.findOne(account.userId) == null && await this.findOnePO(account.phoneNumber) == null) {
            return this.accountRepository.save(account);
        }
        const acc = await this.findOnePO(account.phoneNumber);
        console.log(await this.findOne(account.userId));
        console.log(await this.findOnePO(account.phoneNumber));
        return acc;
    }
    async getTokens(userId) {
        return (await this.findOne(userId)).totalTokens;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(account_1.Account)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map