import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            userProfile: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(mockUser),
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(UsersController);
    service = moduleRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        birthdate: new Date('2000-01-01'),
        password: 'password',
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser]);
    });
  });

  describe('findProfile', () => {
    it('should return the profile of the logged-in user', async () => {
      const req = { user: { email: 'test@example.com' } } as any;
      expect(await controller.findProfile(req)).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      expect(await controller.findOne(1)).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Test Updated',
        lastName: 'User Updated',
        birthdate: new Date('2000-01-02'),
        avatar: 'updated-avatar-url',
      };
      await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const req = { user: { email: 'test@example.com' } } as any;
      await controller.remove(1, req);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user tries to delete someone else', async () => {
      const req = { user: { email: 'test@example.com' } } as any;
      const differentUser = { ...mockUser, email: 'another@example.com' };
      jest.spyOn(service, 'findOne').mockResolvedValue(differentUser);
      try {
        await controller.remove(1, req);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('Not authorized, you can only delete yourself');
      }
    });
  });
});
