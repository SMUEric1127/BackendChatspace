import * as mongoose from 'mongoose';
export declare const PromptSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    status: string;
    username: string;
    response?: string;
    tokens?: number;
}>;
export interface Prompt {
    status: string;
    username: string;
    response: string;
    tokens: Number;
}
