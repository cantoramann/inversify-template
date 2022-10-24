import { inject, injectable } from "inversify";
import Pet from "../../model/Pet";
import DAO from "../base-classes/DAO";

@injectable()
class PetDAO extends DAO<Pet> {
  constructor(
    @inject("Pet")
    protected readonly _pet: typeof Pet
  ) {
    super(_pet);
  }

  async findDistinctTypesByOwnerId(id: string) {
    return this.model.query().select("id", "species").distinct("species").where("pets.ownerId", id);
  }
}

export default PetDAO;
