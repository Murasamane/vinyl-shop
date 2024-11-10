import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  entity: string;

  @Column({ type: 'enum', enum: ['CREATE', 'UPDATE', 'DELETE'] })
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ type: 'int', nullable: true })
  entityId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  performedBy: string;

  @Column({ type: 'json', nullable: true })
  changes: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;
}
