import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SoftDeletableEntity } from '../general/soft-deletable.model';
import { User } from '../users';
import { Permission } from './permission.model';

@Entity()
export class Group extends SoftDeletableEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  public id!: string;

  @Column({
    unique: true,
  })
  @AutoMap()
  public name!: string;

  @Column()
  @AutoMap()
  public description!: string;

  @ManyToMany(() => User, user => user.groups)
  @AutoMap()
  public members!: User[];

  @ManyToMany(() => Permission, permission => permission.groups, {
    eager: true,
  })
  @JoinTable()
  @AutoMap()
  public permissions!: Permission[];
}
