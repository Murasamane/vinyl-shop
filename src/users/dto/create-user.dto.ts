import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: false,
    description: 'The unique ID of the user (optional)',
  })
  id?: number;

  @ApiProperty({ description: 'The first name of the user', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The birthdate of the user',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  birthdate: Date;

  @ApiProperty({
    required: false,
    description: 'The avatar URL of the user (optional)',
    example: 'https://example.com/avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'Password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    description: 'Whether the user is an admin (optional)',
    example: true,
  })
  @IsOptional()
  isAdmin?: boolean;
}
