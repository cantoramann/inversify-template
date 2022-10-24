import { Knex } from "knex";

export const up = async (knex: Knex) => {
  await knex.schema.createTable("gifts", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
    table.timestamps(true, true);
    table.string("ownerId");
    table.string("petId");
    table.boolean("isClaimed").defaultTo(false);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTable("gifts");
};
