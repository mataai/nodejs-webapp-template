import { BadRequestException, Injectable } from '@nestjs/common';

import { FindManyOptions } from 'typeorm';

import {
  GroupAssignMembersDTO,
  GroupAssignPermissionsDTO,
  GroupCreateRequestDTO,
  GroupUpdateRequestDTO,
  PermissionCreateRequestDTO,
  PermissionIdentifier,
  PermissionUpdateRequestDTO,
} from '@webapp-template/auth-contracts';
import {
  Action,
  AuthorizationsDAL,
  entities,
  Group,
  Permission,
  User,
} from '@webapp-template/database';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private _usersService: UsersService,
    private _authorizationRepository: AuthorizationsDAL,
  ) {}

  public getGroupById(id: Group['id']): Promise<Group | null> {
    return this._authorizationRepository.findGroupById(id);
  }
  public getGroups(
    skip = 0,
    take = 10,
    where: string[],
    orderBy: string[],
  ): Promise<Group[]> {
    const options: FindManyOptions<Group> = { skip, take };
    if (where) {
      options.where = {};
      where?.forEach((whereClause) => {
        const [key, value] = whereClause.split(':');
        options.where = { ...options.where, [key]: value };
      });
    }
    if (orderBy) {
      options.order = {};
      orderBy?.forEach((order) => {
        const [key, value] = order.split(':');
        options.order = { ...options.order, [key]: value };
      });
    }
    return this._authorizationRepository.groups({
      ...options,
      relations: ['permissions'],
    });
  }
  public assignPermissionsToGroup(
    groupId: Group['id'],
    request: GroupAssignPermissionsDTO,
    author: User | User['id'],
  ): Promise<Group> {
    return this._authorizationRepository.assignPermissionsToGroup(
      groupId,
      request.permissionIds,
      author,
    );
  }
  public removePermissionsFromGroup(
    groupId: Group['id'],
    request: GroupAssignPermissionsDTO,
    author: User | User['id'],
  ): Promise<Group> {
    return this._authorizationRepository.removePermissionsFromGroup(
      groupId,
      request.permissionIds,
      author,
    );
  }
  public assignMembersToGroup(
    groupId: Group['id'],
    request: GroupAssignMembersDTO,
    author: User | User['id'],
  ): Promise<Group> {
    return this._authorizationRepository.assignMembersToGroup(
      groupId,
      request.userIds,
      author,
    );
  }
  public createGroup(
    request: GroupCreateRequestDTO,
    author: User,
  ): Promise<Group> {
    return this._authorizationRepository.createGroup(request, author);
  }
  public updateGroup(
    id: Group['id'],
    request: GroupUpdateRequestDTO,
    author: User,
  ): Promise<Group> {
    return this._authorizationRepository.updateGroup(id, request, author);
  }
  public deleteGroup(id: Group['id'], author: User): Promise<boolean> {
    return this._authorizationRepository.deleteGroup(id, author);
  }

  public getUserGroups(userId: User['id']): Promise<Group[]> {
    return this._usersService
      .findOneById(userId, ['groups'])
      .then((user) => user.groups || []);
  }

  public getPermissionActions(): string[] {
    return Object.values(Action);
  }
  public getPermissionModels(): string[] {
    return Object.values(entities)
      .map((entity) => entity.name)
      .filter((name) => !name.includes('Logs'));
  }
  public getGroupPermissions(groupId: Group['id']): Promise<Permission[]> {
    return this._authorizationRepository.permissions({
      where: { groups: { id: groupId } },
    });
  }

  public getPermissions(
    skip = 0,
    take = 10,
    where: string[],
    orderBy: string[],
  ): Promise<Permission[]> {
    const options: FindManyOptions<Permission> = { skip, take };
    if (where) {
      options.where = {};
      where?.forEach((whereClause) => {
        const [key, value] = whereClause.split(':');
        options.where = { ...options.where, [key]: value };
      });
    }
    if (orderBy) {
      options.order = {};
      orderBy?.forEach((order) => {
        const [key, value] = order.split(':');
        options.order = { ...options.order, [key]: value };
      });
    }
    return this._authorizationRepository.permissions(options);
  }

  public createPermission(
    request: PermissionCreateRequestDTO,
    author: User,
  ): Promise<Permission> {
    if (!this.getPermissionModels().includes(request.model)) {
      throw new BadRequestException('Model does not exist');
    }
    if (!this.getPermissionActions().includes(request.action)) {
      throw new BadRequestException('Action does not exist');
    }
    return this._authorizationRepository.createPermission(request, author);
  }

  public updatePermission(
    groupId: PermissionIdentifier,
    request: PermissionUpdateRequestDTO,
    author: User | User['id'],
  ): Promise<Permission> {
    return this._authorizationRepository.updatePermission(
      groupId,
      request,
      author,
    );
  }

  public getUserPermissions(userId: User['id']): Promise<Permission[]> {
    return this._usersService
      .findOneById(userId, ['groups.permissions'])
      .then((user) =>
        user.groups
          .map((group) => group.permissions)
          .reduce((acc, permissions) => [...acc, ...permissions], []),
      );
  }
  public deletePermission(
    id: PermissionIdentifier,
    author: User,
  ): Promise<boolean> {
    return this._authorizationRepository.deletePermission(id, author);
  }
}
