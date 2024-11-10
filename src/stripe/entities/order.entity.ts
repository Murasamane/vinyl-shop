import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Record } from 'src/records/entities/record.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the order' })
  id: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @ApiProperty({ type: () => User, description: 'User who made the order' })
  user: User;

  @ManyToOne(() => Record, { eager: true, nullable: false })
  @JoinColumn()
  @ApiProperty({
    type: () => Record,
    description: 'Record associated with the order',
  })
  record: Record;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date when the order was created' })
  purchaseDate: Date;

  @Column({ default: 'pending' })
  @ApiProperty({ description: 'Status of the order', example: 'pending' })
  status: string;
}
