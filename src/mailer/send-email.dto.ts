import { Address } from 'nodemailer/lib/mailer';

export interface SendEmailDTO {
  from?: Address;
  recipient: Address[];
  subject: string;
  html: string;
  text?: string;
  placeholderReplacement?: Record<string, string>;
}
