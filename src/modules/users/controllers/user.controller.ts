import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  CreateUserDto,
  createUserSchema,
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
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  FilterUsersDtoSwagger,
  UpdateUserDtoSwagger,
} from '../dto/swagger-user.dto';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodPipe(filterUsersSchema))
  @ApiQuery({ type: FilterUsersDtoSwagger })
  async findAll(@Query() filter: FilterUsersDto) {
    return await this.userService.findAll(filter);
  }

  @Get('me')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getProfile(@Request() req: AuthenticatedRequest) {
    return await this.userService.findUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'User ID' })
  async findById(@Param(new ZodPipe(IdParamSchema)) params: IdParamDto) {
    return await this.userService.findUser(params.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDtoSwagger })
  async updateUser(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Body(new ZodPipe(updateUserSchema)) updateData: UpdateUserDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.userService.updateUser(params.id, updateData, req.user);
  }

  @Patch('block/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'User ID to block' })
  async blockUser(@Param(new ZodPipe(IdParamSchema)) params: IdParamDto) {
    return await this.userService.setBlockStatus(params.id, true);
  }

  @Patch('unblock/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiParam({ name: 'id', description: 'User ID to unblock' })
  async unblockUser(@Param(new ZodPipe(IdParamSchema)) params: IdParamDto) {
    return await this.userService.setBlockStatus(params.id, false);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiParam({ name: 'id', description: 'User ID to delete' })
  async deleteUser(
    @Param(new ZodPipe(IdParamSchema)) params: IdParamDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.userService.deleteUser(params.id, req.user);
  }
}
