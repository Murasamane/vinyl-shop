import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/guards/AuthenticatedGuard.guard';
import { StripeService } from './stripe.service';
import { Request } from 'express';

@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/create')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a payment for a vinyl record purchase',
    description:
      'This endpoint creates a dummy payment using Stripe for a vinyl record purchase. It requires an authenticated user and will return a client secret needed for the front-end to complete the payment.',
  })
  @ApiBody({
    description: 'Payment information for the vinyl record purchase',
    type: Object,
    examples: {
      example1: {
        summary: 'Payment request example',
        value: {
          amount: 2000,
          recordId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'Payment created successfully, returns client secret for front-end',
    schema: {
      type: 'object',
      properties: {
        clientSecret: {
          type: 'string',
          description: 'Stripe client secret to complete the payment',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters or payment creation failed',
  })
  async createPayment(
    @Body() body: { amount: number; recordId: number },
    @Req() req: Request,
  ) {
    const { amount, recordId } = body;
    const currency = 'usd';

    try {
      const result = await this.stripeService.createDummyPayment(
        req.user['id'],
        recordId,
        amount,
        currency,
      );
      return { clientSecret: result.clientSecret };
    } catch (err) {
      throw new Error('Payment creation failed: ' + `${err.message}`);
    }
  }
}
