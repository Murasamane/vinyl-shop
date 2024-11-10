import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from 'src/stripe/entities/order.entity';
import { Review } from 'src/records/entities/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: number;

  @Column()
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @Column()
  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @Column({ default: '2000-01-01' })
  @ApiProperty({ description: 'Birthdate of the user' })
  birthdate: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Avatar image URL of the user', required: false })
  avatar: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Indicates if the user has admin privileges' })
  isAdmin: boolean;

  @Column({ default: '' })
  @ApiProperty({ description: 'Password of the user', writeOnly: true })
  password: string;

  @OneToMany(() => Review, (review) => review.user, { cascade: ['remove'] })
  @ApiProperty({
    type: () => Review,
    isArray: true,
    description: 'List of user reviews',
  })
  reviews: Review[];

  @OneToMany(() => Order, (order) => order.user, { cascade: ['remove'] })
  @ApiProperty({
    type: () => Order,
    isArray: true,
    description: 'List of user orders',
  })
  orders: Order[];
}
