import { injectable } from "inversify";
import Service from "../base-classes/Service";
import PurchasesDAO from "../../dao/purchases/PurchasesDAO";
import Purchase from "../../model/Purchase";

@injectable()
class PurchasesService extends Service<Purchase> {
  constructor(protected readonly _purchasesDAO: PurchasesDAO) {
    super(_purchasesDAO);
  }

  async findByCustomerId(id: string) {
    return this._purchasesDAO.findByCustomerId(id);
  }
}

export default PurchasesService;
