import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  UpdateUserDto,
  updateUserSchema,
} from '../dto/user.dto';
import {
  FilterUsersDto,
  filterUsersSchema,
  IdParamDto,
  IdParamSchema,
} from '../dto/filter-users.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ZodPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  ApiTags,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RequestUser } from '../interfaces/request-user.interface';
import { User } from 'src/common/decorators/getUser.decorator';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodPipe(filterUsersSchema))
  @ApiQuery({ name: 'isBlocked', required: false, type: Boolean })
  async findAll(@Query() filter: FilterUsersDto) {
    return await this.userService.findAll(filter);
  }

  @Get('me')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getProfile(@User() req: RequestUser) {
    return await this.userService.findUser(req.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'User ID' })
  async findById(@Param(new ZodPipe(IdParamSchema)) params: IdParamDto) {
    return await this.userService.findUser(params.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUser(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Body(new ZodPipe(updateUserSchema)) updateData: UpdateUserDto,
    @User() req: RequestUser,
  ) {
    return await this.userService.updateUser(params.id, updateData, req);
  }

  @Patch('block/:id')
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'User ID to block' })
  async blockUser(@Param(new ZodPipe(IdParamSchema)) params: IdParamDto) {
    return await this.userService.setBlockStatus(params.id, true);
  }

  @Patch('unblock/:id')
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'User ID to unblock' })
  async unblockUser(@Param(new ZodPipe(IdParamSchema)) params: IdParamDto) {
    return await this.userService.setBlockStatus(params.id, false);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'User ID to delete' })
  async deleteUser(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @User() req: RequestUser,
  ) {
    return await this.userService.deleteUser(params.id, req);
  }
}
