import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

export const seed = async (knex: Knex) => {
  // Deletes ALL existing entries
  await knex.raw("truncate table customers restart identity cascade"); 
  await knex.raw("truncate table pets restart identity cascade");
  await knex.raw("truncate table purchases restart identity cascade");

  // customers
  const customers = [];

  for (let i = 0; i < 10; i++) {
    customers.push({
      id: uuidv4(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    });
  }
  await knex("customers").insert(customers);

  // pets
  const pets = [];

  for (let i = 0; i < 20; i++) {
    pets.push({
      id: uuidv4(),
      name: faker.name.firstName(),
      ownerId: faker.helpers.arrayElement(customers).id,
      species: faker.animal.type(),
    });
  }

  await knex("pets").insert(pets);

  // purchases
  const purchases = [];

  for (let i = 0; i < 100; i++) {
    purchases.push({
      id: uuidv4(),
      customerId: faker.helpers.arrayElement(customers).id,
      date: faker.date.past(), // 2021-12-03T05:40:44.408Z format
      total: faker.commerce.price(),
    });
  }

  await knex("purchases").insert(purchases);
};
