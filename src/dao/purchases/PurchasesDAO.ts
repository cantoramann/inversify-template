import { inject, injectable } from "inversify";
import Purchase from "../../model/Purchase";
import DAO from "../base-classes/DAO";
import{ QueryBuilder } from "objection";

@injectable()
class PurchaseDAO extends DAO<Purchase> {
  constructor(
    @inject("Purchase")
    protected readonly _purchase: typeof Purchase
  ) {
    super(_purchase);
  }

  async findByCustomerIdAndDate(id: string, date: string) {
    return this.model.query().select('id').where("customer_id", id).where("date", "<", date) as QueryBuilder<Purchase>;
  }
}

export default PurchaseDAO;
