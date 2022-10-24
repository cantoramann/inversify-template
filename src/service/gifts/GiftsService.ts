import { injectable } from "inversify";
import Service from "../base-classes/Service";
import GiftsDAO from "../../dao/gifts/GiftsDAO";
import Gift from "../../model/Gift";

@injectable()
class GiftsService extends Service<Gift> {
  constructor(protected readonly _giftsDAO: GiftsDAO) {
    super(_giftsDAO);
  }

  async findByOwnerId(id: string) {
    return this._giftsDAO.findByOwnerId(id);
  }
}

export default GiftsService;
