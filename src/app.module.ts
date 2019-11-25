import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserGateway } from './gateway/user.getaway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    UserGateway
  ],
})
export class AppModule {}
