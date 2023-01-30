import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phoneNumber: string;

    @Column()
    userId: string;

    @Column({ default: ''})
    sessionId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: 0})
    totalTokens: number;

    @OneToMany(type => Prompt, prompt => prompt.account)
    prompts: Prompt[]
}

@Entity()
export class Prompt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sessionId: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    prompt: string;

    @Column()
    response: string;

    @Column()
    promptTokens: number;

    @Column()
    completionTokens: number;

    @Column()
    totalTokens: number;

    @ManyToOne(type => Account, account => account.prompts)
    account: Account;
}