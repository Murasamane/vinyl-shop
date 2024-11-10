import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { ReviewRecordDto } from './dto/review-record.dto';
import { AuthenticatedGuard } from 'src/auth/guards/AuthenticatedGuard.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vinyl record (admin only)' })
  @ApiBody({ type: CreateRecordDto })
  @ApiResponse({ status: 201, description: 'Record created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createRecordDto: CreateRecordDto, @Req() req: Request) {
    if (req.user['isAdmin'] === false) {
      throw new UnauthorizedException('Only admins can create vinyl records');
    }

    const admin = {
      firstName: req.user['firstName'],
      lastName: req.user['lastName'],
    };

    const newRecord = {
      ...createRecordDto,
      userId: req.user['id'],
      user: { ...admin },
    };
    return this.recordsService.create(newRecord);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all vinyl records with optional sorting and pagination',
  })
  @ApiQuery({ name: 'sort', required: false, description: 'Sort by field' })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Records retrieved successfully.' })
  findAll(
    @Query('sort') sort?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.recordsService.findAll(sort, order, page, limit);
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a specific record by ID' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiQuery({
    name: 'author',
    required: false,
    description: 'Filter by author',
  })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name' })
  @ApiResponse({ status: 200, description: 'Record retrieved successfully.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('author') author?: string,
    @Query('name') name?: string,
  ) {
    return this.recordsService.findOne(id, author, name);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific record (admin only)' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiBody({ type: UpdateRecordDto })
  @ApiResponse({ status: 200, description: 'Record updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req: Request,
  ) {
    if (req.user['isAdmin'] === false) {
      throw new UnauthorizedException('Only admins can update vinyl records');
    }
    return this.recordsService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a specific record (admin only)' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Record deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (req.user['isAdmin'] === false) {
      throw new UnauthorizedException('Only admins can delete vinyl records');
    }
    return this.recordsService.remove(id);
  }

  @Get(':id/review')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all reviews for a specific record' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully.' })
  getAllReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.recordsService.getAllReviews(id, page, limit);
  }

  @Post(':id/review')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review for a specific record' })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiBody({ type: ReviewRecordDto })
  @ApiResponse({ status: 201, description: 'Review submitted successfully.' })
  writeReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() reviewRecordDto: ReviewRecordDto,
    @Req() req: Request,
  ) {
    const user = {
      firstName: req.user['firstName'],
      lastName: req.user['lastName'],
    };

    const newReview = {
      ...reviewRecordDto,
      userId: req.user['id'],
      user: { ...user },
    };
    return this.recordsService.writeReview(id, newReview);
  }

  @Delete(':id/review')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a review for a specific record (admin only)',
  })
  @ApiParam({ name: 'id', description: 'Record ID' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deleteReview(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (req.user['isAdmin'] === false) {
      throw new UnauthorizedException('Only admins can delete reviews');
    }
    return this.recordsService.deleteReview(id);
  }
}
