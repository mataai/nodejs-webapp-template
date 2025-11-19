import { Injectable } from '@nestjs/common';

import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';

import { Action, entities, User } from '@webapp-template/database';

import { AuthorizationService } from './authorization.service';

export type Subjects = InferSubjects<(typeof entities)[0]> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private _permissionsService: AuthorizationService) {}

  public async createForUser(user: User): Promise<AppAbility> {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    const permissions = await this._permissionsService.getUserPermissions(
      user.id,
    );

    if (user.deletedAt) {
      for (const action of Object.values(Action)) {
        cannot(action, 'all');
        cannot(Action.Update, User, {
          id: '00000000-0000-0000-0000-000000000000',
        });
      }
      return build({
        detectSubjectType: (item) =>
          item.constructor as ExtractSubjectType<Subjects>,
      });
    }

    cannot(Action.Update, User, {
      id: '00000000-0000-0000-0000-000000000000',
    });

    for (const permission of permissions) {
      can(
        permission.action,
        permission.model as unknown as (typeof entities)[0],
      );
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
