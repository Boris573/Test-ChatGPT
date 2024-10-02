import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { environment } from './environment';

@Module({
  imports: [MongooseModule.forRoot(environment.dbUrl), MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
