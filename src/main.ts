import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as crypto from 'crypto';

function createMasterSecretKey() {
  return crypto.randomBytes(32).toString('hex');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!global.secretMasterSecretKey) {
    global.secretMasterSecretKey = createMasterSecretKey();
    setInterval(() => {
      global.secretMasterSecretKey = createMasterSecretKey();
    }, 3 * 60 * 60 * 1000);
  }
  await app.listen(3000);
}
bootstrap();