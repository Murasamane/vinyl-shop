import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Record } from './entities/record.entity';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Review } from './entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Review]), UsersModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
