import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SessionSerializer } from './Serializer';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    GoogleStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
