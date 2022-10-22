import { injectable } from "inversify";
import Service from "../base-classes/Service";
import PetsDAO from "../../dao/pets/PetsDAO";
import Pet from "../../model/Pet";

@injectable()
class PetsService extends Service<Pet> {
  constructor(protected readonly _petsDAO: PetsDAO) {
    super(_petsDAO);
  }

  async findDistinctTypesByOwnerId(id: string) {
    return this._petsDAO.findDistinctTypesByOwnerId(id);
  }
}

export default PetsService;
