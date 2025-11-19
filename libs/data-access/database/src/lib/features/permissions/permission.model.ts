import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToMany, PrimaryColumn, Unique } from 'typeorm';

import { Action } from './action.enum';
import { Group } from './group.model';

export class PermissionIdentifier {
  public action!: Permission['action'];
  public model!: Permission['model'];
}
@Entity()
@Unique(['model', 'action'])
export class Permission {
  @Column()
  @AutoMap()
  public description!: string;

  @PrimaryColumn()
  @AutoMap()
  public model!: string;

  @PrimaryColumn({
    type: 'enum',
    enum: Action,
  })
  @AutoMap(() => String)
  public action!: Action;

  @ManyToMany(() => Group, permission => permission.permissions)
  @AutoMap()
  public groups!: Group[];
}
