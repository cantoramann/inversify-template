import { Model } from "objection";
import Customer from "./Customer";
import Pet from "./Pet";

class Gift extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "gifts";
  }

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: "object",
      required: ["ownerId", "petId", "isClaimed"],

      properties: {
        id: { type: "string" },
        ownerId: { type: "string" },
        petId: { type: "string" },
        isClaimed: { type: "boolean", default: false },
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "gifts.ownerId",
          to: "customers.id",
        },
      },
      pet: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pet,
        join: {
          from: "gifts.petId",
          to: "pets.id",
        },
      }
    };
  }
}

export default Gift;
