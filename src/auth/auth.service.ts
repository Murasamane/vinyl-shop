import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersEntityRepo: Repository<User>,
  ) {}

  async validateUser(details) {
    const user = await this.usersEntityRepo.findOne({
      where: { email: details.email },
    });

    if (user) return user;
    const newUser = this.usersEntityRepo.create(details);
    return this.usersEntityRepo.save(newUser);
  }

  async findUser(id: number) {
    return this.usersEntityRepo.findOne({ where: { id } });
  }
}
