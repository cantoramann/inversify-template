import { inject, injectable } from "inversify";
import Purchase from "../../model/Purchase";
import DAO from "../base-classes/DAO";

@injectable()
class PurchaseDAO extends DAO<Purchase> {
  constructor(
    @inject("Purchase")
    protected readonly _purchase: typeof Purchase
  ) {
    super(_purchase);
  }
}

export default PurchaseDAO;
