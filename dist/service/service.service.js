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
exports.ServiceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt = require("jsonwebtoken");
let ServiceService = class ServiceService {
    constructor(promptModel) {
        this.promptModel = promptModel;
    }
    async extractBearerToken(header) {
        const token = header.authorization.split(' ')[1];
        return token;
    }
    async getUsernameFromHeader(header) {
        const token = await this.extractBearerToken(header);
        const decoded = JSON.parse(JSON.stringify(jwt.verify(token, process.env.SECRET_KEY)));
        console.log("Token: ", token, " - Username: ", decoded.username);
        return decoded.username;
    }
    async getResponseFromStatus(status) {
        return await this.promptModel.find({
            status
        });
    }
    async updateStatus(status, response, tokens) {
        response = response.replace(/\n/g, "");
        return await this.promptModel.findOneAndUpdate({
            status
        }, { $set: {
                response: response,
                tokens: tokens
            }
        });
    }
    async appendPrompt(status, username) {
        return this.promptModel.create({
            status,
            username,
        });
    }
};
ServiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Prompt')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ServiceService);
exports.ServiceService = ServiceService;
//# sourceMappingURL=service.service.js.map