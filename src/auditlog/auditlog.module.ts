import { Module } from '@nestjs/common';
import { AuditlogController } from './auditlog.controller';
import { AuditlogService } from './auditlog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/auditlog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditlogService],
  controllers: [AuditlogController],
})
export class AuditlogModule {}
