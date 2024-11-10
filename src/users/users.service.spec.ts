import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    birthdate: new Date('2000-01-01'),
    avatar: '',
    email: 'test@example.com',
    isAdmin: false,
    password: 'password',
    reviews: [],
    orders: [],
  };

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthdate: new Date('2000-01-01'),
        password: 'password',
      };
      await expect(service.create(createUserDto)).resolves.toEqual(mockUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      await expect(service.findAll()).resolves.toEqual([mockUser]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      await expect(service.findOne(1)).resolves.toEqual(mockUser);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockUser);
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'User',
      };
      await expect(service.update(1, updateUserDto)).resolves.toEqual({
        ...mockUser,
        ...updateUserDto,
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockUser,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const updateUserDto: UpdateUserDto = {
        firstName: 'Updated',
        lastName: 'User',
      };
      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      await expect(service.remove(1)).resolves.toEqual({ affected: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('userProfile', () => {
    it('should return the user profile', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      await expect(service.userProfile('test@example.com')).resolves.toEqual(
        mockUser,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['reviews', 'orders'],
      });
    });
  });
});
