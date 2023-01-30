import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { Account, Prompt } from './entities/account';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Prompt]),
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
