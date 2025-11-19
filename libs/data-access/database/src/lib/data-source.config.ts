import * as dotenv from 'dotenv';
import * as mysqlDriver from 'mysql2';
import { DataSourceOptions } from 'typeorm';

import {
  GameProfile,
  GameProfileLogs,
  Group,
  GroupLogs,
  Permission,
  PermissionLogs,
  Tournament,
  TournamentLogs,
  TranslatedString,
  TranslatedStringLogs,
  User,
  UserLogs,
} from './features';

export const entities = [
  User,
  Tournament,
  Group,
  Permission,
  GameProfile,
  UserLogs,
  TranslatedString,
  TournamentLogs,
  GroupLogs,
  PermissionLogs,
  GameProfileLogs,
  TranslatedStringLogs,
];

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  driver: mysqlDriver,
  type: 'mysql',
  host: process.env['MARIADB_HOST'],
  port: parseInt(process.env['MARIADB_PORT'] || '3306', 10),
  username: process.env['MARIADB_USER'],
  password: process.env['MARIADB_PASSWORD'],
  database: process.env['MARIADB_DATABASE'],
  synchronize: true,
  entities,
};
