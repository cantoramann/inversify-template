import chai from "chai";
import sinon, { SinonSpy, SinonStubbedInstance } from "sinon";
import { Request, Response, NextFunction } from "express";
import Controller from "../CustomersController";
import Service from "../../service/customers/CustomersService";
import ApiError from "../../middleware/ApiError";
import { v4 as uuidv4 } from "uuid";

import PetsService from "../../service/pets/PetsService";
import PurchasesService from "../../service/purchases/PurchasesService";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("src :: controller :: CustomersController", () => {
  let service: SinonStubbedInstance<Service>;
  let petsService: SinonStubbedInstance<PetsService>;
  let purchasesService: SinonStubbedInstance<PurchasesService>;
  let controller: Controller;

  let res: Partial<Response>;
  let req: Partial<Request>;
  let next: SinonSpy;

  beforeEach(() => {
    service = sandbox.createStubInstance(Service);
    petsService = sandbox.createStubInstance(PetsService);
    purchasesService = sandbox.createStubInstance(PurchasesService); 
    
    service.getAll = sandbox.stub();

    controller = new Controller(service, petsService, purchasesService);

    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub().returnsThis(),
    };

    next = sandbox.spy();
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  describe("# getAll", () => {
    context("when there isn't an error", () => {
      it("calls service.getAll()", async () => {
        // arrange
        // act
        await controller.getAll(req as Request, res as Response, next);
        // assert
        sandbox.assert.calledOnce(service.getAll);
      });
    });

    context("when there is an error", () => {
      it("calls next with ApiError.internal", async () => {
        // arrange
        service.getAll.rejects(new Error("error"));
        // act
        await controller.getAll(req as Request, res as Response, next);
        // assert
        sandbox.assert.calledOnce(next);
        sandbox.assert.calledWith(next, sandbox.match.instanceOf(ApiError));
      });
    });
  });

  describe("# applyGift", () => {
    context("when there isn't an error", () => {
      it("calls service.findById()", async () => {
        // arrange
        const customerId = uuidv4();
        req = {
          params: {
            customerId
          },
        };
        // act
        await controller.applyGift(req as Request, res as Response, next);
        // assert
        sandbox.assert.calledOnce(service.findById);
      });
    });

    context("when there is an error", () => {
      it("calls next with ApiError.internal", async () => {
        // arrange
        service.findById.rejects(new Error("error"));
        // act
        await controller.applyGift(req as Request, res as Response, next);
        // assert
        sandbox.assert.calledOnce(next);
        sandbox.assert.calledWith(next, sandbox.match.instanceOf(ApiError));
      });
    });
  });
});

