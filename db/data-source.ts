import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';
import { Review } from 'src/records/entities/review.entity';
import { SessionEntity } from 'src/session.entity';
import { Order } from 'src/stripe/entities/order.entity';
import { AuditLog } from 'src/auditlog/entities/auditlog.entity';

ConfigModule.forRoot();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get<string>('HOST'),
  port: configService.get<number>('DB_PORT'),
  database: configService.get<string>('DATA_BASE_NAME'),
  username: configService.get<string>('DATA_BASE_USER'),
  password: configService.get<string>('DATA_BASE_PASSWORD'),
  entities: [User, Record, Review, SessionEntity, Order, AuditLog],
  synchronize: false,
  migrations: [__dirname + '/../db/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
