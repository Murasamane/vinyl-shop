import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditlogService } from '../auditlog.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditlogService: AuditlogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    let action: 'CREATE' | 'UPDATE' | 'DELETE' | null = null;
    if (method === 'POST') action = 'CREATE';
    else if (method === 'PUT' || method === 'PATCH') action = 'UPDATE';
    else if (method === 'DELETE') action = 'DELETE';

    if (!action) {
      return next.handle();
    }

    const entity = request.route.path.split('/')[1];
    const performedBy = request.user ? request.user.email : 'unknown';

    const entityId = request.body?.recordId || request.params.id || null;
    return next.handle().pipe(
      tap(async () => {
        await this.auditlogService.logAction(
          entity,
          action,
          entityId,
          performedBy,
          request.body,
        );
      }),
    );
  }
}
