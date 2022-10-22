import { Model } from "objection";
import Pet from "./Pet";
import Purchase from "./Purchase";

class Customer extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "customers";
  }

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstName", "lastName", "email"],

      properties: {
        id: { type: "string" },
        firstName: { type: "string", minLength: 1, maxLength: 255 },
        lastName: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string" },
        gift: { type: "string" }
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      pets: {
        relation: Model.HasManyRelation,
        modelClass: Pet,
        join: {
          from: "customers.id",
          to: "pets.ownerId",
        },
      },

      purchases: {
        relation: Model.HasManyRelation,
        modelClass: Purchase,
        join: {
          from: "customers.id",
          to: "purchases.customerId",
        },
      },
    };
  }
}

export default Customer;
