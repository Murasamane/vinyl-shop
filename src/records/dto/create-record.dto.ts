import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the record',
    example: 'The Dark Side of the Moon',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The author or artist of the record',
    example: 'Pink Floyd',
  })
  author: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The price of the record',
    example: 25,
  })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'A detailed description of the record',
    example: 'A classic album from Pink Floyd released in 1973.',
  })
  description: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'The release date of the record',
    example: '1973-03-01',
  })
  releaseDate: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the user who is adding the record',
    example: 1,
  })
  userId: number;
}
