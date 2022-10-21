import { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.alterTable("customers", (table) => {
    table.string("gifts");
  });
};

export const down = (knex: Knex) =>
  knex.schema.alterTable("customers", (table) => {
    table.dropColumn("gifts");
  });
