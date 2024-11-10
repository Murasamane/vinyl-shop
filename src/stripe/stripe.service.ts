import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Record } from '../records/entities/record.entity';
import { Order } from '../stripe/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { SendEmailDTO } from '../mailer/send-email.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly mailerService: MailerService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
  }

  async createDummyPayment(
    userId: number,
    recordId: number,
    amount: number,
    currency: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const record = await this.recordRepository.findOne({
      where: { id: recordId },
    });
    if (!record) throw new NotFoundException('Record not found');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
    });

    await this.stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa',
    });

    const order = new Order();
    order.user = user;
    order.record = record;
    order.purchaseDate = new Date();
    order.status = 'completed';
    await this.orderRepository.save(order);

    const recepient: SendEmailDTO = {
      from: { name: 'OG Store', address: 'ogstore2023@gmail.com' },
      recipient: [{ name: user.firstName, address: user.email }],
      subject: 'Purchase notification',
      html: `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vinyl Records Store - Email Notification</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px; color: #333;">Welcome to OG Store, ${user.firstName}!</h1>
        </div>
        <div style="font-size: 16px; line-height: 1.5; color: #333;">
            <p>Thank you for joining OG Store, your go-to store for vinyl records! We're excited to offer you a unique collection of classic and new vinyl records. Whether you're a collector or a new listener, there's something here for you.</p>
            
            <!-- Featured Record Section -->
            <div style="margin-top: 20px; text-align: center; background-color: #f8f8f8; padding: 10px; border-radius: 8px;">
                <h2>Featured Vinyl</h2>
                <p><strong>Album Title:</strong> ${record.name}</p>
                <p><strong>Artist:</strong> ${record.author}</p>
            </div>
            
            <p>If you need any help or have any questions about our vinyl records, don't hesitate to get in touch with our support team.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 30px;">
            <p>Best regards,</p>
            <p> OG Store Team</p>
            <p>If you did not sign up for this service, please ignore this email.</p>
        </div>
    </div>
</body>
</html>`,
    };

    await this.mailerService.sendEmail(recepient);

    return { clientSecret: paymentIntent.client_secret };
  }
}
