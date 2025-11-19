import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Action } from '../permissions';

export abstract class LogBase {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'enum',
    enum: Action,
  })
  public action!: Action;

  @CreateDateColumn()
  public timestamp!: Date;

  @Column({ default: false })
  public reverted!: boolean;

  @Column()
  public authorId!: string;

  @Column({ nullable: true })
  public oldData!: string;

  @Column({ nullable: true })
  public newData!: string;
}

@Entity()
export class UserLogs extends LogBase {
  @Column()
  public userId!: string;
}

@Entity()
export class GroupLogs extends LogBase {
  @Column()
  public groupId!: string;
}

@Entity()
export class PermissionLogs extends LogBase {
  @Column()
  public model!: string;

  @Column({
    type: 'enum',
    enum: Action,
  })
  public permissionAction!: Action;
}

@Entity()
export class TranslatedStringLogs extends LogBase {
  @PrimaryColumn()
  public language!: string;

  @PrimaryColumn()
  public key!: string;
}

