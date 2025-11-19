import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Group } from '../permissions';
import { GameProfile } from '../tournaments';

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

  @OneToMany(() => GameProfile, gameProfile => gameProfile.player)
  @AutoMap()
  public gameProfiles!: GameProfile[];

  @ManyToMany(() => Group, group => group.members)
  @AutoMap()
  @JoinTable()
  public groups!: Group[];

  @Column({ type: 'timestamp', nullable: true })
  @AutoMap()
  public deletedAt!: Date;
}
