import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            synchronize: true
        }
    )]
})
export class DatabaseModule {}
