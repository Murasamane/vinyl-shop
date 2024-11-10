import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from '../auth/guards/AuthenticatedGuard.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'Data to create a new user',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request if the data is invalid',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the logged-in user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if the user is not logged in',
  })
  async findProfile(@Req() req: Request) {
    const userProfile = await this.usersService.userProfile(req.user['email']);
    return userProfile;
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found by ID',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiBody({
    description: 'Data to update the user',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request if data is invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden if the user is not an admin',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if the user tries to delete someone else',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = await this.usersService.findOne(id);
    if (user.email !== req.user['email']) {
      throw new UnauthorizedException(
        'Not authorized, you can only delete yourself',
      );
    }
    return this.usersService.remove(id);
  }
}
