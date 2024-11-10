import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { ConfigService, ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const configService = new ConfigService();

@Module({
  imports: [
    Mailer.forRoot({
      transport: {
        host: configService.get<string>('MAILER_HOST'),
        name: configService.get<string>('MAILER_NAME'),
        port: configService.get<number>('MAILER_PORT'),
        secure: false,
        auth: {
          user: configService.get<string>('MAILER_USER'),
          pass: configService.get<string>('MAILER_PASSWORD'),
        },
      },
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
