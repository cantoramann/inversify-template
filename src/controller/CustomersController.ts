import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import Service from "../service/customers/CustomersService";
import PetsService from "../service/pets/PetsService";
import PurchasesService from "../service/purchases/PurchasesService";
import ApiError from "../middleware/ApiError";
import Purchase from "../model/Purchase";

@injectable()
class CustomersController {
  constructor(private readonly _service: Service, private readonly _petsService: PetsService, 
    private readonly _purchasesService: PurchasesService) {
    this.getAll = this.getAll.bind(this);
    this.applyGift = this.applyGift.bind(this);
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

  async applyGift(req: Request, res: Response, next: NextFunction) {
    try {
      // arrange
      const { customerId } = req.params;

      // check if customer exists.
      let customer = await this._service.findById(customerId);
      if (!customer) {
        return res.status(200).json({
          message: `Customer with id ${customerId} does not exist.`,
          ok: true
        });

      }
      // intermediate arrange for customer object prep
      const customerObj = customer?.$toDatabaseJson();

      // check if customer has an applied gift.
      if (customerObj.gift) {
        return res.status(200).json({
          message: `Customer with id ${customerId} already has a gift applied.`,
          ok: true
        });
      }

      // intermediate arrange for date filter prep
      let d = new Date();
      d.setMonth(d.getMonth() - 6);
      const dateFilter = d.toISOString();
      console.log(dateFilter);

      // check if customer is eligible for a gift.
      const allPurchases = await this._purchasesService.findByCustomerIdAndDate(customerId, dateFilter);
      const eligiblePurchases = allPurchases.filter((purchase: any) => {
        return new Date().getTime() - new Date(purchase.date).getTime() >= 1000 * 60 * 60 * 24 * 30;
      });
      if (eligiblePurchases.length == 0) {
        return res.status(200).json({
          message: `Customer with id ${customerId} is not eligible for a gift.`,
          ok: true
        });
      }

      // retrieve all pets of customer
      // todo: optimize in db level
      const pets = await this._petsService.findByOwnerId(customerId);

      // filter unique pet types
      // todo: optimize in db level
      const set = new Set(pets);
      const uniquePets = Array.from(set);

      // deduce a random pet gift for customer
      const randomSpecies = uniquePets[Math.floor(Math.random() * uniquePets.length)].$toDatabaseJson().species;

      // update customer column with gift
      customer = await this._service.patchAndFetchById(customerId, { gift: randomSpecies });

      // return updated customer
      return res.status(200).json({
        message: `Customer with id ${customerId} has been updated with a gift.`,
        appliedGift: customer.$toDatabaseJson().gift,
        ok: true
      });

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }
}

export default CustomersController;
