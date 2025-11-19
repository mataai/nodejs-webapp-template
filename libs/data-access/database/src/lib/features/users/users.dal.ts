import { BadRequestException, Injectable } from '@nestjs/common';

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
import { GroupLogs, UserLogs } from '../logs';
import { Action } from '../permissions';
import { User } from './user.model';

@Injectable()
export class UsersDAL {
  constructor(
    private _dataSource: DataSource,
    private _databaseHistoryService: DatabaseHistoryService
  ) {}

  private get _usersRepository(): Repository<User> {
    return this._dataSource.getRepository(User);
  }

  public async findOneById(
    id: string,
    relations?: FindOptionsRelations<User>
  ): Promise<User | null> {
    return this._usersRepository.findOne({
      where: { id },
      relations,
    });
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this._usersRepository.findOneBy({ email });
  }
  public async users(
    options: FindManyOptions<User>
  ): Promise<[User[], number]> {
    return this._usersRepository.findAndCount(options);
  }

  public async createUser(
    data: DeepPartial<User>,
    author: User | User['id']
  ): Promise<User | null> {
    try {
      const generatedModel = this._usersRepository.create(data);
      const result = await this._usersRepository.save(generatedModel);

      const logResult = await this._databaseHistoryService.createUserLog({
        action: 'create',
        authorId: author instanceof User ? author.id : author,
        userId: result.id,
        newData: JSON.stringify(result),
      } as DeepPartial<UserLogs>);

      if (!logResult) {
        throw new Error('Failed to log the creation');
      }

      return result;
    } catch (e) {
      // Why does typeorm's types not include all the properties of their error...
      const error = e as QueryFailedError & { code?: string };
      throw new BadRequestException({
        message: 'Failed to create the user',
        code: error.code,
        extra: e,
      });
    }
  }
  public async updateUser(
    id: User['id'],
    data: QueryDeepPartialEntity<User>,
    author: User | User['id']
  ): Promise<User | null> {
    const old = await this._usersRepository.findOneBy({ id });
    if (!old) {
      throw new BadRequestException('User does not exist');
    }

    const newUser = { ...old, ...data };

    const diff = getDifferingProperties(old, newUser);
    if (Object.keys(diff.updatedDiff).length === 0)
      throw new BadRequestException('No changes detected');

    await this._usersRepository.update(id, newUser);

    const logResult = await this._databaseHistoryService.createUserLog({
      action: 'update',
      authorId: author instanceof User ? author.id : author,
      userId: id,
      oldData: JSON.stringify(diff.oldDiff),
      newData: JSON.stringify(diff.updatedDiff),
    } as DeepPartial<UserLogs>);

    if (!logResult) {
      throw new Error('Failed to log the update');
    }

    return this._usersRepository.findOneBy({ id });
  }

  public async deleteUser(
    id: User['id'],
    author: User | User['id']
  ): Promise<boolean> {
    const old = JSON.stringify(await this._usersRepository.findOneBy({ id }));
    const result = await this._usersRepository.softDelete(id);

    const logResult = await this._databaseHistoryService.createUserLog({
      action: 'delete',
      authorId: author instanceof User ? author.id : author,
      userId: id,
      oldData: old,
      newData: JSON.stringify(result),
    } as DeepPartial<UserLogs>);

    if (!logResult) {
      throw new Error('Failed to log the deletion');
    }

    return (result?.affected || 0) > 0;
  }

  public async addGroupsToUser(
    id: string,
    groupIds: string[],
    author: User
  ): Promise<User> {
    try {
      const user = await this._usersRepository.findOne({
        where: { id },
        relations: ['groups'],
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      const oldGroups = [...user.groups];
      const newGroups = [];

      for (const groupId of groupIds) {
        if (!user.groups.some((g) => g.id == groupId)) {
          newGroups.push({ id: groupId });
        }
      }

      if (newGroups.length == 0)
        throw new BadRequestException('User already has these groups');

      const updatedData = await this._usersRepository.save({
        ...user,
        groups: [...oldGroups, ...newGroups],
      });

      this._databaseHistoryService.createUserLog({
        action: Action.Create,
        authorId: author instanceof User ? author.id : author,
        userId: updatedData.id,
        oldData: JSON.stringify({ groups: oldGroups.map((g) => g.id) }),
        newData: JSON.stringify({ groups: newGroups }),
      } as DeepPartial<GroupLogs>);

      return this._usersRepository.findOne({
        where: { id },
        relations: ['groups'],
      }) as Promise<User>;
    } catch (e) {
      throw new BadRequestException({
        message: 'Failed to add groups to user',
        extra: e,
      });
    }
  }

  public async removeGroupsFromUser(
    id: string,
    groupIds: string[],
    author: User
  ): Promise<User> {
    try {
      const user = await this._usersRepository.findOne({
        where: { id },
        relations: ['groups'],
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      const oldGroups = [...user.groups];
      const newGroups: string[] = [];

      for (const groupId of groupIds) {
        if (user.groups.some((g) => g.id == groupId)) {
          newGroups.push(groupId);
        }
      }

      if (newGroups.length == 0)
        throw new BadRequestException('User does not have these groups');

      const updatedData = await this._usersRepository.save({
        ...user,
        groups: oldGroups.filter((g) => !newGroups.includes(g.id)),
      });

      this._databaseHistoryService.createUserLog({
        action: Action.Delete,
        authorId: author instanceof User ? author.id : author,
        userId: updatedData.id,
        oldData: JSON.stringify({ groups: oldGroups.map((g) => g.id) }),
        newData: JSON.stringify({ groups: newGroups }),
      } as DeepPartial<GroupLogs>);

      return this._usersRepository.findOne({
        where: { id },
        relations: ['groups'],
      }) as Promise<User>;
    } catch (e) {
      console.error(e);
      throw new BadRequestException('Failed to remove groups from user');
    }
  }
}
