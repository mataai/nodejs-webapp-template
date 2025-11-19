import { Injectable } from '@nestjs/common';

import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelationsProperty,
  FindOptionsWhere,
} from 'typeorm';

import {
  UserAssignGroupsDTO,
  UserCreateRequestDTO,
  UserUpdateRequestDTO,
} from '@webapp-template/auth-contracts';
import { User, UsersDAL } from '@webapp-template/database';
import { PaginatedResponseDto } from '@webapp-template/generic-contracts';

@Injectable()
export class UsersService {
  private readonly authorizedRelations: (keyof User)[] = ['groups'];
  constructor(private _usersRepository: UsersDAL) {}

  /**
   * Method used by the route to find a user by id
   * @param relations list of relations to include in the query
   * @returns
   */
  public findOneById(
    id: string,
    relationsList: string[] = []
  ): Promise<User | null> {
    const relations = {} as {
      [key: string]: FindOptionsRelationsProperty<User> | boolean;
    };
    relationsList
      ?.filter((relation) => {
        const array = relation.split('.');
        const first = array[0].trim() as keyof User;
        return array.length > 1
          ? this.authorizedRelations.includes(first)
          : first;
      })
      .forEach((relation) => {
        if (relation.includes('.')) {
          const keys = relation.split('.');
          relations[keys[0]] = {} as FindOptionsRelationsProperty<User>;
          let current = relations[keys[0] as keyof User] as {
            [key: string]: FindOptionsRelationsProperty<User>;
          };
          for (let i = 1; i < keys.length; i++) {
            const key: keyof User = keys[i] as keyof User;
            if (i == keys.length - 1) {
              current[key] = true;
            } else {
              current[key] = {} as FindOptionsRelationsProperty<User>;
              current = current[key] as {
                [key: string]: FindOptionsRelationsProperty<User>;
              };
            }
          }
        } else {
          relations[relation] = true;
        }
      });
    return this._usersRepository.findOneById(id, relations);
  }

  /**
   * Method used by the authentification service to find a user by email to check the password
   * @param email
   * @returns
   */
  public findOneForLogin(email: string): Promise<User | null> {
    return this._usersRepository.findOneByEmail(email);
  }
  /**
   * Method used by the authentification guard to add the user to the request and the route decorator
   * @param id the user's id
   * @returns the user if it exists.
   */
  public findOneForGuard(id: User['id']): Promise<User | null> {
    return this._usersRepository.findOneById(id, {
      groups: {
        permissions: true,
      },
    });
  }

  public async users(
    page = 0,
    pageSize = 10,
    where: FindOptionsWhere<User>,
    order: FindOptionsOrder<User>
  ): Promise<PaginatedResponseDto<User>> {
    const options: FindManyOptions<User> = {
      skip: pageSize * page,
      take: pageSize,
      ...(where ? { where } : {}),
      ...(order ? { order } : {}),
    };
    console.log(options, pageSize, page);
    // if (where) {
    //   options.where = {};
    //   where?.forEach((whereClause) => {
    //     const [key, value] = whereClause.split(':');
    //     options.where = { ...options.where, [key]: value };
    //   });
    // }
    // if (order) {
    //   options.order = {};
    //   order?.forEach((order) => {
    //     const [key, value] = order.split(':');
    //     options.order = { ...options.order, [key]: value };
    //   });
    // }
    options.relations = ['groups'];
    return this._usersRepository
      .users(options)
      .then(
        (users) =>
          new PaginatedResponseDto<User>(users[0], users[1], page, pageSize)
      );
  }

  public async createUser(
    data: UserCreateRequestDTO,
    author: User
  ): Promise<User> {
    return this._usersRepository.createUser(data, author);
  }

  public async updateUser(
    id: User['id'],
    data: UserUpdateRequestDTO,
    author: User
  ): Promise<User> {
    return this._usersRepository.updateUser(id, data, author);
  }

  public async deleteUser(id: User['id'], author: User): Promise<boolean> {
    return this._usersRepository.deleteUser(id, author);
  }

  public addUserToGroups(
    id: string,
    groupIds: UserAssignGroupsDTO,
    author: User
  ): Promise<User> {
    return this._usersRepository.addGroupsToUser(id, groupIds.groupIds, author);
  }

  public removeUserFromGroups(
    id: string,
    groupIds: UserAssignGroupsDTO,
    author: User
  ): Promise<User> {
    return this._usersRepository.removeGroupsFromUser(
      id,
      groupIds.groupIds,
      author
    );
  }
}
