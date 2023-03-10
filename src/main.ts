import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const requestIp = require('request-ip');

const dotenv = require('dotenv')
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
