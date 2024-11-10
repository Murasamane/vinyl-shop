import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewRecordDto {
  @ApiProperty({
    description: 'The rating given to the record',
    example: 4,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    description: 'The review comment for the record',
    example: 'Great album!',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'The ID of the user who is writing the review',
    example: 1,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
