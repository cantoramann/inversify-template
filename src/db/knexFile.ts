import { knexSnakeCaseMappers } from 'objection';
import config from '../config/config';

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexFile = {
  client: "pg",
  connection: {
    host: config.db.host,
    user: config.db.user,
    port: config.db.port,
    password: config.db.password,
    database: config.db.name,
    timezone: 'UTC' // https://github.com/Vincit/objection.js/issues/434

  },
  pool: {
    min: 0,
    max: 100,
  },
  migrations: { tableName: "knex_migrations" },
  seeds: {
    directory: "./seeds",
  },
  // automatically convert camelCase to snake case
  // so table names are in snake case
  // but we can use camelCase fields per default
  ...knexSnakeCaseMappers(),
};

export default knexFile;
