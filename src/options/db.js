import _knex from "knex";
import { configMariaDB } from "./config_mariadb.js";
import { configSQlite } from "./config_sqlite.js";

export const knexMariaDB = _knex(configMariaDB);
export const knexSQlite = _knex(configSQlite);
