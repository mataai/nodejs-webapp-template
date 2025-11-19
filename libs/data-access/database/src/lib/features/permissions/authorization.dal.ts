import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOptionsRelations,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { getDifferingProperties } from '@webapp-template/function-utils';

import { DatabaseHistoryService } from '../../database-history.service';
import { FilterInput } from '../general';
import { GroupLogs, PermissionLogs } from '../logs';
import {
  Action,
  Group,
  Permission,
  PermissionIdentifier,
} from '../permissions';
import { User } from '../users';

@Injectable()
export class AuthorizationsDAL {
  constructor(
    private _dataSource: DataSource,
    private _databaseHistoryService: DatabaseHistoryService,
  ) {}

  private get _permissionsRepository(): Repository<Permission> {
    return this._dataSource.getRepository(Permission);
  }
  private get _groupsRepository(): Repository<Group> {
    return this._dataSource.getRepository(Group);
  }

  public async findGroupById(
    id: string,
    relations?: FindOptionsRelations<Group>,
  ): Promise<Group | null> {
    return this._groupsRepository.findOne({
      where: { id },
      relations,
    });
  }
  public async groups(options: FindManyOptions<Group>): Promise<Group[]> {
    return this._groupsRepository.find(options);
  }
  public async assignMembersToGroup(
    groupId: Group['id'],
    userIds: User['id'][],
    author: User | User['id'],
  ): Promise<Group | null> {
    try {
      const group = await this._groupsRepository.findOne({
        where: { id: groupId },
        relations: ['members'],
      });

      if (!group) {
        throw new BadRequestException('Group not found');
      }

      this._dataSource
        .createQueryBuilder()
        .relation(Group, 'members')
        .of(group)
        .add(userIds);

      this._databaseHistoryService.createGroupLog({
        action: Action.Update,
        authorId: author instanceof User ? author.id : author,
        oldData: JSON.stringify(group),
      } as DeepPartial<GroupLogs>);

      return this._groupsRepository.findOneBy({ id: groupId });
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Failed to assign members to group');
    }
  }
  public async assignPermissionsToGroup(
    groupId: Group['id'],
    permissionIds: PermissionIdentifier[],
    author: User | User['id'],
  ): Promise<Group | null> {
    try {
      const group = await this._groupsRepository.findOneBy({ id: groupId });
      if (!group) {
        throw new BadRequestException('Group not found');
      }
      const oldPermissions = [...group.permissions];
      const newPermissions = [];
      for (const permissionId of permissionIds) {
        if (
          !group.permissions.some(
            p =>
              p.model === permissionId.model &&
              p.action === permissionId.action,
          )
        ) {
          newPermissions.push(permissionId);
        }
      }
      if (newPermissions.length === 0)
        throw new BadRequestException('No changes detected');

      //TODO: Should we check if the permissions exist?
      const updatedData = await this._groupsRepository.save({
        ...group,
        permissions: [...group.permissions, ...newPermissions],
      });

      this._databaseHistoryService.createGroupLog({
        action: Action.Create,
        authorId: author instanceof User ? author.id : author,
        groupId: groupId,
        oldData: JSON.stringify(oldPermissions),
        newData: JSON.stringify(newPermissions),
      } as DeepPartial<GroupLogs>);

      return updatedData;
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      const error: { [key: string]: object } = e as { [key: string]: object };
      console.error(error['code'], error['parameters']);
      throw new BadRequestException({
        message: 'Failed to assign permissions to group',
        code: error['code'],
        extra: error['parameters'],
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  public async removePermissionsFromGroup(
    groupId: Group['id'],
    permissionIds: PermissionIdentifier[],
    author: User | User['id'],
  ): Promise<Group | null> {
    try {
      const group = await this._groupsRepository.findOneBy({ id: groupId });
      if (!group) {
        throw new BadRequestException('Group not found');
      }
      const oldPermissions = [...group.permissions];
      const permissionsToRemove: PermissionIdentifier[] = [];
      for (const permissionId of permissionIds) {
        if (
          group.permissions.some(
            p =>
              p.model === permissionId.model &&
              p.action === permissionId.action,
          )
        ) {
          permissionsToRemove.push(permissionId);
        }
      }
      if (permissionsToRemove.length === 0)
        throw new BadRequestException('No changes detected');

      const updatedData = await this._groupsRepository.save({
        ...group,
        permissions: group.permissions.filter(x =>
          permissionsToRemove.some(
            y => y.model === x.model && y.action === x.action,
          ),
        ),
      });

      this._databaseHistoryService.createGroupLog({
        action: Action.Delete,
        authorId: author instanceof User ? author.id : author,
        groupId: groupId,
        oldData: JSON.stringify(oldPermissions),
        newData: JSON.stringify(permissionsToRemove),
      } as DeepPartial<GroupLogs>);

      return updatedData;
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      const error: { [key: string]: object } = e as { [key: string]: object };
      console.error(error['code'], error['parameters']);
      throw new BadRequestException({
        message: 'Failed to assign permissions to group',
        code: error['code'],
        extra: error['parameters'],
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  public async createGroup(
    data: DeepPartial<Group>,
    author: User | User['id'],
  ): Promise<Group | null> {
    try {
      const generatedModel = this._groupsRepository.create(data);

      const result = await this._groupsRepository.save(generatedModel);

      const logResult = await this._databaseHistoryService.createGroupLog({
        action: Action.Create,
        authorId: author instanceof User ? author.id : author,
        groupId: generatedModel.id,
        newData: JSON.stringify(result),
      } as DeepPartial<GroupLogs>);

      if (!logResult) {
        throw new Error('Failed to log the creation');
      }

      return result;
    } catch (e) {
      // Why does typeorm's types not include all the properties of their error...
      const error = e as QueryFailedError & { code?: string };
      throw new BadRequestException('Failed to create the group', error.code);
    }
  }
  public async updateGroup(
    groupId: Group['id'],
    data: QueryDeepPartialEntity<Group>,
    author: User | User['id'],
  ): Promise<Group | null> {
    const group = await this._groupsRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new BadRequestException('Group not found');
    }

    const newGroup = { ...group, ...data };
    const diff = getDifferingProperties(group, newGroup);
    if (Object.keys(diff.updatedDiff).length === 0)
      throw new BadRequestException('No changes detected');

    await this._groupsRepository.update(groupId, data);

    const logResult = await this._databaseHistoryService.createGroupLog({
      action: 'update',
      authorId: author instanceof User ? author.id : author,
      groupId: groupId,
      oldData: JSON.stringify(diff.oldDiff),
      newData: JSON.stringify(diff.updatedDiff),
    } as DeepPartial<GroupLogs>);

    if (!logResult) {
      throw new Error('Failed to log the update');
    }

    return this._groupsRepository.findOneBy({ id: groupId });
  }
  public async deleteGroup(
    id: Group['id'],
    author: User | User['id'],
  ): Promise<boolean> {
    const old = await this._groupsRepository.findOneBy({ id });

    if (!old || old.deletedAt) {
      return false;
    }

    const result = await this._groupsRepository.softDelete(id);

    const logResult = await this._databaseHistoryService.createGroupLog({
      action: 'delete',
      authorId: author instanceof User ? author.id : author,
      groupId: id,
      oldData: JSON.stringify(old),
    } as DeepPartial<GroupLogs>);

    if (!logResult) {
      throw new Error('Failed to log the deletion');
    }

    return (result?.affected || 0) > 0;
  }

  public async findPermissionById(
    id: PermissionIdentifier,
    relations?: FindOptionsRelations<Group>,
  ): Promise<Permission | null> {
    return this._permissionsRepository.findOne({
      where: { ...id },
      relations,
    });
  }
  public async permissions(
    options?: FilterInput<Permission>,
  ): Promise<Permission[]> {
    return this._permissionsRepository.find(options);
  }
  public async createPermission(
    data: DeepPartial<Permission>,
    author: User | User['id'],
  ): Promise<Permission | null> {
    try {
      const generatedModel = this._permissionsRepository.create(data);
      const result = await this._permissionsRepository.save(generatedModel);

      const logResult = await this._databaseHistoryService.createPermissionLog({
        action: 'create',
        authorId: author instanceof User ? author.id : author,
        model: result.model,
        permissionAction: result.action,
        newData: JSON.stringify(result),
      } as DeepPartial<PermissionLogs>);

      if (!logResult) {
        throw new Error('Failed to log the creation');
      }

      return result;
    } catch (e) {
      // Why does typeorm's types not include all the properties of their error...
      const error = e as QueryFailedError & { code?: string };
      throw new BadRequestException({
        message: 'Failed to create the permission',
        code: error.code,
        extra: e,
      });
    }
  }
  public async updatePermission(
    id: PermissionIdentifier,
    data: QueryDeepPartialEntity<Permission>,
    author: User | User['id'],
  ): Promise<Permission | null> {
    const old = await this._permissionsRepository.findOneBy(id);
    if (!old) {
      throw new BadRequestException('Permission not found');
    }

    const diff = getDifferingProperties(old, { ...old, ...data });
    if (Object.keys(diff.updatedDiff).length === 0)
      throw new BadRequestException('No changes detected');

    const result = await this._permissionsRepository.update(id, data);
    if (!result) {
      throw new InternalServerErrorException('Update failed');
    }

    const logResult = await this._databaseHistoryService.createPermissionLog({
      action: 'update',
      authorId: author instanceof User ? author.id : author,
      model: id.model,
      permissionAction: id.action,
      oldData: JSON.stringify(diff.oldDiff),
      newData: JSON.stringify(diff.updatedDiff),
    } as DeepPartial<PermissionLogs>);

    if (!logResult) {
      throw new InternalServerErrorException('Update failed');
    }

    return this._permissionsRepository.findOneBy(id);
  }
  public async deletePermission(
    id: PermissionIdentifier,
    author: User | User['id'],
  ): Promise<boolean> {
    const old = await this._permissionsRepository.findOneBy(id);

    const result = await this._permissionsRepository.delete(id);
    if (!result) {
      throw new InternalServerErrorException('Deletion failed');
    }

    const logResult = await this._databaseHistoryService.createPermissionLog({
      action: 'delete',
      authorId: author instanceof User ? author.id : author,
      model: id.model,
      permissionAction: id.action,
      oldData: JSON.stringify(old),
    } as DeepPartial<PermissionLogs>);

    if (!logResult) {
      throw new InternalServerErrorException('Deletion failed');
    }

    return (result?.affected || 0) > 0;
  }
}
