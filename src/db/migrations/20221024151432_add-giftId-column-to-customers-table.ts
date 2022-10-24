import { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.alterTable("customers", (table) => {
    table.string("giftId");
  });
};

export const down = (knex: Knex) =>
  knex.schema.alterTable("customers", (table) => {
    table.dropColumn("giftId");
  });
