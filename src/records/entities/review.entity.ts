import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Record } from './record.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the review' })
  id: number;

  @Column('text')
  @ApiProperty({ description: 'The comment left by the user' })
  comment: string;

  @Column('int')
  @ApiProperty({
    description: 'The rating given by the user',
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'The timestamp when the review was created' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reviews)
  @ApiProperty({
    type: () => User,
    description: 'The user who wrote the review',
  })
  user: User;

  @ManyToOne(() => Record, (record) => record.reviews, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Record, description: 'The record being reviewed' })
  record: Record;
}
