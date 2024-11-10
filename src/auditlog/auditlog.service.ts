import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/auditlog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditlogService {
  constructor(
    @InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>,
  ) {}

  async logAction(
    entity: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityId: number,
    performedBy: string,
    changes?: Record<string, any>,
  ): Promise<AuditLog> {
    const log = this.repo.create({
      entity,
      action,
      entityId,
      performedBy,
      changes,
      timestamp: new Date(),
    });
    return this.repo.save(log);
  }

  async getLogs(
    entity?: string,
    action?: 'CREATE' | 'UPDATE' | 'DELETE',
    startDate?: Date,
    endDate?: Date,
  ): Promise<AuditLog[]> {
    const query = this.repo.createQueryBuilder('log');

    if (entity) {
      query.andWhere('log.entity = :entity', { entity });
    }

    if (action) {
      query.andWhere('log.action = :action', { action });
    }

    if (startDate) {
      query.andWhere('log.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('log.timestamp <= :endDate', { endDate });
    }

    query.orderBy('log.timestamp', 'DESC');

    return query.getMany();
  }
}
