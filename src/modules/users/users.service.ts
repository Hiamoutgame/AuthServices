import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const { name, email, password } = createUserDto;

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException(`Email "${email}" is already in use`);
    }

    const user = this.usersRepository.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<GetUserDto[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<GetUserDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing) {
        throw new BadRequestException(
          `Email "${updateUserDto.email}" is already in use`,
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    await this.usersRepository.softDelete(id);
  }
}
