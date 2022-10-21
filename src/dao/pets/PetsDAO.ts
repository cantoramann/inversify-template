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

  async findByOwnerId(id: string) {
    return this.model.query().where("owner_id", id) as QueryBuilder<Pet>;
  }
}

export default PetDAO;
