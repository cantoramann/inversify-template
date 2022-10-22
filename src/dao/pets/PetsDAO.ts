import { inject, injectable } from "inversify";
import Pet from "../../model/Pet";
import DAO from "../base-classes/DAO";
import{ QueryBuilder } from "objection";


@injectable()
class PetDAO extends DAO<Pet> {
  constructor(
    @inject("Pet")
    protected readonly _pet: typeof Pet
  ) {
    super(_pet);
  }

  async findDistinctTypesByOwnerId(id: string) {
    return this.model.query().distinct("species").where("pets.ownerId", id);
  }
}

export default PetDAO;
