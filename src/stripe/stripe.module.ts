import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/records/entities/record.entity';
import { User } from 'src/users/entities/user.entity';
import { Order } from './entities/order.entity';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Record]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule,
  ],
  providers: [StripeService],
  controllers: [StripeController],
})
export class StripeModule {}
