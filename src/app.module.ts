import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from '@core';
import { ModulesModule } from '@modules';

@Module({
  imports: [CoreModule, ModulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
