import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Review } from './review.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier of the record' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The name of the record' })
  name: string;

  @Column()
  @ApiProperty({ description: 'The author of the record' })
  author: string;

  @Column()
  @ApiProperty({ description: 'The price of the record' })
  price: number;

  @Column('text')
  @ApiProperty({ description: 'A description of the record' })
  description: string;

  @Column()
  @ApiProperty({ description: 'The release date of the record' })
  releaseDate: Date;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @ApiProperty({
    type: () => User,
    description: 'The user who created the record',
  })
  user: User;

  @OneToMany(() => Review, (review) => review.record, { cascade: true })
  @ApiProperty({
    type: () => Review,
    isArray: true,
    description: 'The reviews of the record',
  })
  reviews: Review[];

  @ApiProperty({
    description: 'The average rating of the record',
    required: false,
  })
  get averageRating(): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    return totalRating / this.reviews.length;
  }
}
