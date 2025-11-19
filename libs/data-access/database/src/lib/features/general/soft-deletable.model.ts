import { DeleteDateColumn } from 'typeorm';

export abstract class SoftDeletableEntity {
  @DeleteDateColumn()
  public deletedAt?: Date;
}
