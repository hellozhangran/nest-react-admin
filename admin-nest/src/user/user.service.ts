import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    // 初始化
  }

  async register(user: Partial<CreateUserDto>) {
    // 添加参数验证
    if (!user) {
      throw new HttpException('用户数据不能为空', HttpStatus.BAD_REQUEST);
    }

    const { name } = user;
    if (!name) {
      throw new HttpException('用户名不能为空', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userRepository.findOne({ where: { name } });
    if (existingUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return this.userRepository.findOne({ where: { name } });
  }

  // 定义一个类型，至少包含pageNum, pageSize
  async findAll(query: any): Promise<{ list: UserEntity[]; total: number }> {
    const { pageNum = 1, pageSize = 10, ...rest } = query;
    console.log('findAll', pageNum, pageSize, rest);
    const skip = (pageNum - 1) * pageSize;
    const take = pageSize;

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take,
      where: rest,
      order: {
        age: 'DESC',
      },
    });
    return {
      list: users,
      total,
    };
  }

  async update(id: number, user: Partial<UserEntity>): Promise<UserEntity> {
    const { name } = user;
    if (!name) {
      throw new HttpException('用户名不能为空', HttpStatus.BAD_REQUEST);
    }
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.update(id, user);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    return updatedUser as UserEntity;
  }

  async remove(id: number): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(id);
    return existingUser;
  }
}
