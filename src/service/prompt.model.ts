import * as mongoose from 'mongoose';

export const PromptSchema = new mongoose.Schema({
    status: { type: String, required: true},
    username: { type: String, required: true},
    response: { type: String, required: false},
    tokens: { type: Number, required: false},
});

export interface Prompt {
    status: string;
    username: string;
    response: string;
    tokens: Number;
}