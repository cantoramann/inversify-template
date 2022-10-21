import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import Service from "../service/customers/CustomersService";
import PetsService from "../service/pets/PetsService";
import PurchasesService from "../service/purchases/PurchasesService";
import ApiError from "../middleware/ApiError";

@injectable()
class CustomersController {
  constructor(private readonly _service: Service, private readonly _petsService: PetsService, private readonly _purchasesService: PurchasesService) {
    this.getAll = this.getAll.bind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._service.getAll();
      return res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }
}

export default CustomersController;
