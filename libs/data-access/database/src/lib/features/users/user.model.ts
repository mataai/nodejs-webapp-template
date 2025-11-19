import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../permissions';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  public id!: string;

  @Column({ unique: true })
  @AutoMap()
  public email!: string;

  @Column()
  public password!: string;

  @Column({ unique: true, nullable: true })
  @AutoMap()
  public displayName!: string;

  @ManyToMany(() => Group, (group) => group.members)
  @AutoMap()
  @JoinTable()
  public groups!: Group[];

  @Column({ type: 'timestamp', nullable: true })
  @AutoMap()
  public deletedAt!: Date;
}
