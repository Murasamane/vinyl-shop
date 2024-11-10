import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The first name of the user (optional)',
    example: 'John',
    required: false,
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The last name of the user (optional)',
    example: 'Doe',
    required: false,
  })
  lastName?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'The birthdate of the user (optional)',
    example: '1990-01-01',
    required: false,
  })
  birthdate?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The avatar URL of the user (optional)',
    example: 'https://example.com/avatar.png',
    required: false,
  })
  avatar?: string;
}
