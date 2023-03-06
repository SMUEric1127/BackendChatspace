import { HttpStatus } from '@nestjs/common';
import { ServiceService } from './service.service';
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
    getHello(headers: any): string;
    genResponse(prompt: string, headers: any): Promise<{
        status: any;
    }>;
    getResponseFromStatus(status: string, ip: any): Promise<{
        status: HttpStatus;
        response: string;
    } | {
        status: HttpStatus;
        response?: undefined;
    }>;
}
