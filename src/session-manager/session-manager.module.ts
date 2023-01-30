import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Prompt } from 'src/users/entities/account';
import { UsersService } from 'src/users/services/users.service';
import { SessionManagerController } from './controllers/session-manager.controller';
import { SessionManagerService } from './services/session-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Prompt])],
  controllers: [SessionManagerController],
  providers: [SessionManagerService, UsersService], 
})
export class SessionManagerModule {}
