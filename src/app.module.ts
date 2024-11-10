import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecordsModule } from './records/records.module';
import { UsersModule } from './users/users.module';
import { StripeModule } from './stripe/stripe.module';
import { MailerModule } from './mailer/mailer.module';
import { AuditlogService } from './auditlog/auditlog.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './auditlog/interceptors/audit.interceptor';
import { AuditLog } from './auditlog/entities/auditlog.entity';
import { AuditlogModule } from './auditlog/auditlog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([AuditLog]),
    UsersModule,
    RecordsModule,
    MailerModule,
    AuthModule,
    PassportModule.register({ session: true }),
    StripeModule,
    AuditlogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuditlogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
