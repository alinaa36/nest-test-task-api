import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUser, User } from '../types/user.type';
import { UserRole } from '../enums/role.enum';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(newUser: CreateUserDto) {
    await this.emailIsUnique(newUser.email);

    const user = await this.userRepository.create(newUser);
    return user;
  }

  async findUser(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async findAll(filter: FilterUsersDto) {
    const users = await this.userRepository.findAll(filter);
    return users;
  }

  async updateUser(userId: string, updateData: UpdateUser, user: RequestUser) {
    this.userHasAccess(user, userId);

    if (updateData.email) {
      await this.emailIsUnique(updateData.email, userId);
    }

    const updateUser = await this.userRepository.update(userId, updateData);
    return updateUser;
  }

  async setBlockStatus(id: string, isBlocked: boolean) {
    const updatedUser = await this.userRepository.update(
      id,
      { isBlocked },
      { isBlocked: isBlocked ? false : true },
    );

    if (!updatedUser) {
      const status = isBlocked ? 'blocked' : 'unblocked';
      throw new BadRequestException(`User is already ${status}`);
    }

    return updatedUser;
  }

  async deleteUser(userId: string, user: RequestUser) {
    this.userHasAccess(user, userId);

    const result = await this.userRepository.delete(userId);

    if (!result || result.numDeletedRows === 0) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return result;
  }

  private userHasAccess(user: RequestUser, targetUserId: string) {
    if (user.role !== UserRole.ADMIN && user.id !== targetUserId) {
      throw new ForbiddenException('You can only access or edit your own data');
    }
  }

  private async emailIsUnique(email: string, excludeUserId?: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser && existingUser.id !== excludeUserId) {
      throw new BadRequestException(`User with email ${email} already exists`);
    }
  }
}
