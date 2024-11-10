import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDto } from './create-record.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecordDto extends PartialType(CreateRecordDto) {
  @ApiPropertyOptional({
    description: 'The name of the vinyl record',
    example: 'Abbey Road',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'The author of the vinyl record',
    example: 'The Beatles',
  })
  author?: string;

  @ApiPropertyOptional({
    description: 'The price of the vinyl record',
    example: 20,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'A brief description of the vinyl record',
    example: 'Classic album by The Beatles',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'The release date of the vinyl record',
    example: '1969-09-26',
  })
  releaseDate?: string;
}
