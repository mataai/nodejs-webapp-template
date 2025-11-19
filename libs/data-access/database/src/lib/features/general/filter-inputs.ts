import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export interface FilterInput<T> {
  skip?: number;
  take?: number;
  where?: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
  orderBy?: FindOptionsOrder<T>;
}
