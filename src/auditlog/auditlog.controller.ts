import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuditlogService } from './auditlog.service';
import { AuthenticatedGuard } from 'src/auth/guards/AuthenticatedGuard.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auditlog')
@Controller('auditlog')
export class AuditlogController {
  constructor(private readonly auditlogService: AuditlogService) {}

  @Get('/logs')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all audit logs (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getLogs(@Req() req: Request) {
    if (req.user['isAdmin'] === false) {
      throw new UnauthorizedException('Not authorized');
    }
    return this.auditlogService.getLogs();
  }
}
