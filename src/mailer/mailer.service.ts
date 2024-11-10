import { Injectable } from '@nestjs/common';
import { SendEmailDTO } from './send-email.dto';
import { MailerService as MailService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailService: MailService) {}

  async sendEmail(dto: SendEmailDTO) {
    const { from, recipient, subject, text, html } = dto;
    return this.mailService.sendMail({
      to: recipient,
      from: from,
      subject: subject,
      html: html,
      text: text,
    });
  }
}
