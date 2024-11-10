import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { ReviewRecordDto } from './dto/review-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';
import { Review } from './entities/review.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record) private readonly repo: Repository<Record>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    private readonly userService: UsersService,
  ) {}
  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const user = await this.userService.findOne(createRecordDto.userId);
    const admin = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createRecordDto.userId} not found`,
      );
    }

    const record = this.repo.create({
      ...createRecordDto,
      user: admin,
    });
    return this.repo.save(record);
  }

  async findAll(
    sort: string = '',
    order: 'ASC' | 'DESC' = 'ASC',
    page = 1,
    limit = 2,
  ) {
    const queryBuilder = this.repo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.reviews', 'review')
      .leftJoinAndSelect('review.user', 'reviewUser')
      .leftJoinAndSelect('record.user', 'user');

    if (sort) {
      if (['price', 'name', 'author', 'id'].includes(sort)) {
        queryBuilder.orderBy(`record.${sort}`, order);
      }
    }

    const [records, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return records.map((record) => ({
      id: record.id,
      name: record.name,
      author: record.author,
      price: record.price,
      description: record.description,
      releaseDate: record.releaseDate,
      reviews: record.reviews.map((review) => ({
        id: review.id,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          avatar: review.user.avatar,
        },
      })),
      user: {
        id: record.user.id,
        firstName: record.user.firstName,
        lastName: record.user.lastName,
        avatar: record.user.avatar,
      },
      total,
      page,
      lastPage: Math.ceil(total / limit),
    }));
  }

  async findOne(id: number, author: string = '', name: string = '') {
    const queryBuilder = this.repo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.reviews', 'review')
      .leftJoinAndSelect('review.user', 'reviewUser')
      .leftJoinAndSelect('record.user', 'user')
      .where('record.id = :id', { id });
    if (author) {
      queryBuilder.andWhere('record.author = :author', { author });
    }

    if (name) {
      queryBuilder.andWhere('record.name = :name', { name });
    }

    const record = await queryBuilder.getOne();

    if (!record) {
      throw new NotFoundException(`Record with ID ${id} not found`);
    }

    return {
      id: record.id,
      name: record.name,
      author: record.author,
      price: record.price,
      description: record.description,
      releaseDate: record.releaseDate,
      reviews: record.reviews.map((review) => ({
        id: review.id,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          avatar: review.user.avatar,
        },
      })),
      user: {
        id: record.user.id,
        firstName: record.user.firstName,
        lastName: record.user.lastName,
        avatar: record.user.avatar,
      },
      averageRating: record.averageRating,
    };
  }

  async update(id: number, updateRecordDto: UpdateRecordDto) {
    const record = await this.findOne(id);

    if (!record) throw new NotFoundException('Record not found');

    Object.assign(record, updateRecordDto);

    return this.repo.save(record);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }

  async getAllReviews(id: number, page: number = 1, limit: number = 10) {
    const record = await this.repo.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
    });

    if (!record) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedReviews = record.reviews.slice(startIndex, endIndex);

    return {
      data: paginatedReviews.map((review) => ({
        id: review.id,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt,
        user: {
          id: review.user.id,
          avatar: review.user.avatar,
          firstName: review.user.firstName,
          lastName: review.user.lastName,
        },
      })),
      total: record.reviews.length,
      page,
      lastPage: Math.ceil(record.reviews.length / limit),
    };
  }

  async writeReview(id: number, reviewRecordDto: ReviewRecordDto) {
    const user: User = await this.userService.findOne(reviewRecordDto.userId);
    const record = await this.repo.findOne({ where: { id } });
    const recordReview = {
      comment: reviewRecordDto.comment,
      rating: reviewRecordDto.rating,
      user: {
        avatar: user.avatar,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      record,
    };
    const review = this.reviewRepo.create(recordReview);
    return this.reviewRepo.save(review);
  }

  async deleteReview(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    return this.reviewRepo.remove(review);
  }
}
