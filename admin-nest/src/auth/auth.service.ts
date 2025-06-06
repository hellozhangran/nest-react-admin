import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}


  createToken(user: Partial<UserEntity>): { token: string } {
    const payload = { username: user.name, userid: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      token,
    };
  }

  login(user: Partial<UserEntity>) {
    console.log(user);
  }

}
