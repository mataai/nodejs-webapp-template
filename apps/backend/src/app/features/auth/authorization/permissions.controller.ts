import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiTags } from '@nestjs/swagger';

import { MapInterceptor } from '@automapper/nestjs';

import {
  PermissionCreateRequestDTO,
  PermissionDTO,
  PermissionUpdateRequestDTO,
} from '@webapp-template/auth-contracts';
import { Action, Permission, User } from '@webapp-template/database';

import { RequestUser } from '../../../core/decorators/user.decorator';
import { AuthGuard } from '../authentication';
import { AuthorizationService } from './authorization.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private _authService: AuthorizationService) {}

  @Get('actions')
  @ApiAcceptedResponse({ type: String, isArray: true })
  public getActions() {
    return this._authService.getPermissionActions();
  }
  @Get('models')
  @ApiAcceptedResponse({ type: String, isArray: true })
  public getModels() {
    return this._authService.getPermissionModels();
  }

  @Get()
  @ApiAcceptedResponse({ type: PermissionDTO, isArray: true })
  @UseInterceptors(
    MapInterceptor(Permission, PermissionDTO, {
      isArray: true,
    }),
  )
  public query(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('where') where: string,
    @Query('orderBy') orderBy: string,
  ) {
    return this._authService.getPermissions(
      skip,
      take,
      where?.split(','),
      orderBy?.split(','),
    );
  }

  @Post()
  @ApiAcceptedResponse({ type: PermissionDTO })
  @UseGuards(AuthGuard)
  @UseInterceptors(MapInterceptor(Permission, PermissionDTO))
  public create(
    @Body() body: PermissionCreateRequestDTO,
    @RequestUser() author: User,
  ) {
    return this._authService.createPermission(body, author);
  }

  @Patch(':model/:action')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: PermissionDTO })
  @UseInterceptors(MapInterceptor(Permission, PermissionDTO))
  public update(
    @Param('action') action: Action,
    @Param('model') model: string,
    @Body() body: PermissionUpdateRequestDTO,
    @RequestUser() author: User,
  ) {
    return this._authService.updatePermission({ model, action }, body, author);
  }

  @Delete(':model/:action')
  @ApiAcceptedResponse({})
  @UseGuards(AuthGuard)
  public delete(
    @Param('action') action: Action,
    @Param('model') model: string,
    @RequestUser() author: User,
  ) {
    return this._authService.deletePermission({ action, model }, author);
  }
}
