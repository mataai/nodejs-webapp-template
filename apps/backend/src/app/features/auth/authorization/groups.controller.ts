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

import { MapInterceptor } from '@automapper/nestjs';

import {
  GroupAssignPermissionsDTO,
  GroupCreateRequestDTO,
  GroupDTO,
  GroupUpdateRequestDTO,
} from '@webapp-template/auth-contracts';
import { Action, Group, User } from '@webapp-template/database';

import { RequestUser } from '../../../core/decorators/user.decorator';
import { AuthGuard } from '../authentication';
import { AuthorizationService } from './authorization.service';
import { PoliciesGuard } from './guards/policies.guard';
import { CheckPolicies } from './policies/policy.decorator';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private _authService: AuthorizationService) {}

  @Get()
  @ApiAcceptedResponse({ type: GroupDTO, isArray: true })
  @UseInterceptors(MapInterceptor(Group, GroupDTO, { isArray: true }))
  public query(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('where') where: string,
    @Query('orderBy') orderBy: string,
  ) {
    return this._authService.getGroups(
      skip,
      take,
      where?.split(','),
      orderBy?.split(','),
    );
  }

  @Get(':id')
  @ApiAcceptedResponse({ type: GroupDTO })
  @UseInterceptors(MapInterceptor(Group, GroupDTO))
  public get(@Param('id') id: string) {
    return this._authService.getGroupById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Group))
  @ApiAcceptedResponse({ type: GroupDTO })
  @UseInterceptors(MapInterceptor(Group, GroupDTO))
  public create(
    @RequestUser() author: User,
    @Body() body: GroupCreateRequestDTO,
  ) {
    return this._authService.createGroup(body, author);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, Group))
  @ApiAcceptedResponse({ type: GroupDTO })
  @UseInterceptors(MapInterceptor(Group, GroupDTO))
  public update(
    @Param('id') id: string,
    @Body() body: GroupUpdateRequestDTO,
    @RequestUser() author: User,
  ) {
    return this._authService.updateGroup(id, body, author);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, Group))
  @ApiAcceptedResponse({ type: GroupDTO, status: HttpStatus.ACCEPTED })
  public delete(@Param('id') id: string, @RequestUser() author: User) {
    return this._authService.deleteGroup(id, author);
  }

  @Post(':id/permissions')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: GroupDTO })
  @UseInterceptors(MapInterceptor(Group, GroupDTO))
  public addPermissionToGroup(
    @Param('id') groupId: string,
    @RequestUser() author: User,
    @Body() body: GroupAssignPermissionsDTO,
  ) {
    return this._authService.assignPermissionsToGroup(groupId, body, author);
  }
  @Delete(':id/permissions')
  @UseGuards(AuthGuard)
  @ApiAcceptedResponse({ type: GroupDTO })
  @UseInterceptors(MapInterceptor(Group, GroupDTO))
  public removePermissionToGroup(
    @Param('id') groupId: string,
    @RequestUser() author: User,
    @Body() body: GroupAssignPermissionsDTO,
  ) {
    return this._authService.removePermissionsFromGroup(groupId, body, author);
  }
}
