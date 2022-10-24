import { inject, injectable } from "inversify";
import Gift from "../../model/Gift";
import DAO from "../base-classes/DAO";
import{ QueryBuilder } from "objection";


@injectable()
class GiftDAO extends DAO<Gift> {
  constructor(
    @inject("Gift")
    protected readonly _gift: typeof Gift
  ) {
    super(_gift);
  }

  async findByOwnerId(id: string) {
    return this.model.query().where("gifts.ownerId", id).where("gifts.isClaimed", false).first();
  }
}

export default GiftDAO;
