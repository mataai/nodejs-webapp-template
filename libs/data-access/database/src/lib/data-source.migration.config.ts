import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { dataSourceOptions as defaultOptions } from './data-source.config';

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  ...defaultOptions,
  migrations: ['libs/data-access/database/src/lib/migrations/*.ts'],
};
export default new DataSource(dataSourceOptions);
