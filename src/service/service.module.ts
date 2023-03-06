import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptSchema } from './prompt.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: "Prompt", schema: PromptSchema}])],
  providers: [ServiceService],
  controllers: [ServiceController]
})
export class ServiceModule {}
