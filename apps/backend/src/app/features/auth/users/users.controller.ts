import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';

import { Mapper } from '@automapper/core';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';

import {
  UserAssignGroupsDTO,
  UserCreateRequestDTO,
  UserDTO,
  UserUpdateRequestDTO,
} from '@webapp-template/auth-contracts';
import { User } from '@webapp-template/database';
import { PaginatedResponseDto } from '@webapp-template/generic-contracts';

import { RequestUser } from '../../../core/decorators/user.decorator';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('Users')
export class UsersController {
  constructor(
    private _usersService: UsersService,
    @InjectMapper() private readonly _mapper: Mapper,
  ) {}

  @Get()
  @ApiAcceptedResponse()
  @UseGuards(AuthGuard)
  public query(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('where') where: string | null,
    @Query('orderBy') orderBy: string | null,
  ): Promise<PaginatedResponseDto<UserDTO>> {
    console.log(page, pageSize);
    return this._usersService
      .users(
        page - 1,
        pageSize,
        where ? JSON.parse(where) : '',
        orderBy ? JSON.parse(orderBy) : '',
      )
      .then((result) => {
        return {
          ...result,
          data: this._mapper.mapArray(result.data, User, UserDTO),
        };
      });
  }

  @Get(':id')
  @ApiAcceptedResponse()
  @UseGuards(AuthGuard)
  @UseInterceptors(MapInterceptor(User, UserDTO))
  public get(
    @Param('id') id: string,
    @Query('relations') relations: string,
  ): Promise<User | null> {
    return this._usersService.findOneById(id, relations.split(','));
  }

  @Post()
  @ApiAcceptedResponse({ type: UserDTO })
  @UseGuards(AuthGuard)
  @UseInterceptors(MapInterceptor(User, UserDTO))
  public create(
    @Body() body: UserCreateRequestDTO,
    @RequestUser() author: User,
  ) {
    return this._usersService.createUser(body, author);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: UserDTO })
  @UseInterceptors(MapInterceptor(User, UserDTO))
  public update(
    @Param('id') id: string,
    @Body() body: UserUpdateRequestDTO,
    @RequestUser() author: User,
  ) {
    return this._usersService.updateUser(id || author.id, body, author);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: UserDTO, status: HttpStatus.ACCEPTED })
  public delete(@Param('id') id: string, @RequestUser() author: User) {
    return this._usersService.deleteUser(id || author.id, author);
  }

  @Post(':id/groups')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: UserDTO })
  @UseInterceptors(MapInterceptor(User, UserDTO))
  public addUserToGroups(
    @Param('id') id: string,
    @Body() groupIds: UserAssignGroupsDTO,
    @RequestUser() author: User,
  ) {
    return this._usersService.addUserToGroups(id, groupIds, author);
  }
  @Delete(':id/groups')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: UserDTO })
  @UseInterceptors(MapInterceptor(User, UserDTO))
  public removeUserGroups(
    @Param('id') id: string,
    @Body() groupIds: UserAssignGroupsDTO,
    @RequestUser() author: User,
  ) {
    return this._usersService.removeUserFromGroups(id, groupIds, author);
  }
}
