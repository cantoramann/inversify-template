import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import Service from "../service/customers/CustomersService";
import PetsService from "../service/pets/PetsService";
import PurchasesService from "../service/purchases/PurchasesService";
import GiftsService from "../service/gifts/GiftsService";
import ApiError from "../middleware/ApiError";
import Purchase from "../model/Purchase";
import Customer from "../model/Customer";
import Pet from "../model/Pet";

@injectable()
class CustomersController {
  constructor(private readonly _service: Service, private readonly _petsService: PetsService, 
    private readonly _purchasesService: PurchasesService, private readonly _giftsService: GiftsService) {
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
      const { customerId = "<no id provided>" } = req.params;

      // check regex
      const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
      if (!regexExp.test(customerId)) {
        return res.status(400).json({ 
          code: 1,
          message: `Customer with id ${customerId} does not exist.`,
          ok: true
         });
      }

      // check if customer exists.
      let customer : Customer | undefined = await this._service.findById(customerId);
      if (!customer) {
        return res.status(400).json({
          code: 2,
          message: `Customer with id ${customerId} does not exist.`,
          ok: true
        });
      }
      const customerObj = customer?.$toDatabaseJson();

      // check if customer has an applied gift.
      if (customerObj.giftId) {
        return res.status(400).json({
          code: 3,
          message: `Customer with id ${customerId} already has a gift applied.`,
          ok: true
        });
      }

      // prepare the date for 6 months ago in UTC timezone. knexfile is set to UTC timezone.
      let d = new Date();
      d.setMonth(d.getMonth() - 6);
      const dateFilter = d.toISOString(); 

      // check if customer is eligible for a gift.
      const eligiblePurchases : Array<Purchase> | undefined = await this._purchasesService.findByCustomerIdAndDate(customerId, dateFilter);
      if (eligiblePurchases.length == 0) {
        return res.status(400).json({
          code: 4,
          message: `Customer with id ${customerId} is not eligible for a gift.`,
          ok: true
        });
      }

      // retrieve all unique pets of customer - customer should always have pets as immutability is guaranteed.
      const uniquePets : Array<Pet> | undefined  = await this._petsService.findDistinctTypesByOwnerId(customerId);

      // choose a random pet gift for customer
      const randomPet = uniquePets[Math.floor(Math.random() * uniquePets.length)].$toDatabaseJson();

      // insert gift entry and update customer column with gift id
      let appliedGift : any = await this._giftsService.insert({ ownerId: customerId, petId: randomPet.id });
      appliedGift = appliedGift.$toDatabaseJson();
      customer = await this._service.patchAndFetchById(customerId, { giftId: appliedGift.id });

      // return updated customer
      return res.status(200).json({
        code: 0,
        message: `Customer with id ${customerId} has been updated with a gift.`,
        appliedGiftTo: randomPet.id,
        petSpecies: randomPet.species,
        ok: true
      });

    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }
}

export default CustomersController;
