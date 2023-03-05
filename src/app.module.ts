import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [AuthModule, UsersModule, MongooseModule.forRoot(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.l27sagd.mongodb.net/?retryWrites=true`), ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// Bx7UHAYgaFfDhk0m