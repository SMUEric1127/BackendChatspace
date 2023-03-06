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
exports.SessionManagerController = void 0;
const common_1 = require("@nestjs/common");
const session_manager_service_1 = require("../services/session-manager.service");
let SessionManagerController = class SessionManagerController {
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async test() {
        return "SESS OK";
    }
    async authenticate(response, body) {
        console.log("IP ADDRESS: ", response.ip);
        const sessionId = await this.sessionService.handshake(body);
        return response.status(common_1.HttpStatus.OK).json(sessionId);
    }
    async getResponseDirect(response, body) {
        const responseString = await this.sessionService.getResponseDirect(body);
        return response.status(common_1.HttpStatus.OK).json(responseString);
    }
    async getResponse(response, body) {
        const responseString = await this.sessionService.getResponse(body);
        return response.status(common_1.HttpStatus.OK).json(responseString);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SessionManagerController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('handshake'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionManagerController.prototype, "authenticate", null);
__decorate([
    (0, common_1.Post)('promptDirect'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionManagerController.prototype, "getResponseDirect", null);
__decorate([
    (0, common_1.Post)('prompt'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SessionManagerController.prototype, "getResponse", null);
SessionManagerController = __decorate([
    (0, common_1.Controller)('session-manager'),
    __metadata("design:paramtypes", [session_manager_service_1.SessionManagerService])
], SessionManagerController);
exports.SessionManagerController = SessionManagerController;
//# sourceMappingURL=session-manager.controller.js.map