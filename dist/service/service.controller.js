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
exports.ServiceController = void 0;
const common_1 = require("@nestjs/common");
const route_params_decorator_1 = require("@nestjs/common/decorators/http/route-params.decorator");
const passport_1 = require("@nestjs/passport");
const openai_1 = require("openai");
const service_service_1 = require("./service.service");
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
let ServiceController = class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    getHello(headers) {
        this.serviceService.getUsernameFromHeader(headers);
        return "Welcome to Services Backend API";
    }
    async genResponse(prompt, headers) {
        const status = uuidv4();
        var response = openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: Number(process.env.MAX_TOKENS),
            messages: [{ role: "user", content: `rule: response under ${process.env.MAX_TOKENS} tokens \n` + prompt }],
        });
        response.then(async (response) => {
            console.log("Done processing, total tokens: ", response.data.usage["total_tokens"]);
            await this.serviceService.updateStatus(status, response.data.choices[0].message["content"], response.data.usage["total_tokens"]);
            console.log("Posted to MongoDB");
        }).catch((error) => {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
        });
        const username = await this.serviceService.getUsernameFromHeader(headers);
        this.serviceService.appendPrompt(status, username);
        return { status };
    }
    async getResponseFromStatus(status, ip) {
        console.log("Retrieving: ", status, " - from IP: ", ip);
        const prompt = await this.serviceService.getResponseFromStatus(status);
        const response = prompt[0]["response"];
        if (response != "") {
            return {
                status: common_1.HttpStatus.ACCEPTED,
                response: response
            };
        }
        else {
            return {
                status: common_1.HttpStatus.NO_CONTENT,
            };
        }
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __param(0, (0, route_params_decorator_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], ServiceController.prototype, "getHello", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/prompt'),
    __param(0, (0, route_params_decorator_1.Body)('prompt')),
    __param(1, (0, route_params_decorator_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "genResponse", null);
__decorate([
    (0, common_1.Get)('/prompt'),
    __param(0, (0, route_params_decorator_1.Query)('status')),
    __param(1, (0, route_params_decorator_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "getResponseFromStatus", null);
ServiceController = __decorate([
    (0, common_1.Controller)('service'),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], ServiceController);
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map