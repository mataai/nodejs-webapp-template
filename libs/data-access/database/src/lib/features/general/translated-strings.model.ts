import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['key', 'language'])
export class TranslatedString {
  @PrimaryColumn()
  public key!: string;

  @PrimaryColumn()
  public language!: string;

  @Column()
  public value!: string;
}
