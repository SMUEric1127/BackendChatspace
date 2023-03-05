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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const openai_1 = require("openai");
const dotenv = require('dotenv');
dotenv.config();
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
let ServiceController = class ServiceController {
    getHello() {
        return "Service API";
    }
    async genImage() {
        var image_url;
        try {
            const response = await openai.createImage({
                prompt: "a white siamese cat",
                n: 1,
                size: "256x256",
            });
            image_url = response.data.data[0].url;
            console.log(image_url);
        }
        catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
        }
        return image_url;
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ServiceController.prototype, "getHello", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('gen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServiceController.prototype, "genImage", null);
ServiceController = __decorate([
    (0, common_1.Controller)('service')
], ServiceController);
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map