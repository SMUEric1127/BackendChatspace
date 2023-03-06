export declare class Account {
    id: number;
    phoneNumber: string;
    userId: string;
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
    totalTokens: number;
    prompts: Prompt[];
}
export declare class Prompt {
    id: number;
    sessionId: string;
    createdAt: Date;
    prompt: string;
    response: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    account: Account;
}
