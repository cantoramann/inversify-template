import chai from "chai";
import sinon, { SinonStubbedInstance } from "sinon";
import DAO from "../../dao/purchases/PurchasesDAO";
import { v4 as uuidv4 } from 'uuid';

// file under test
import Service from "./PurchasesService";
import PurchasesDAO from "../../dao/purchases/PurchasesDAO";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("src :: service :: purchases :: PurchasesService", () => {
  // test double variables (stubs))
  let dao: SinonStubbedInstance<PurchasesDAO>;

  let service: Service;
  beforeEach(() => {
    dao = sandbox.createStubInstance(DAO);
    dao.getAll = sandbox.stub();
    dao.insert = sandbox.stub();
    dao.insertGraph = sandbox.stub();
    dao.findById = sandbox.stub();
    dao.truncate = sandbox.stub();
    dao.deleteById = sandbox.stub();
    dao.patchAndFetchById = sandbox.stub();
    dao.findByCustomerId = sandbox.stub();

    service = new Service(dao);
  });

  afterEach(() => {
    sandbox.restore();
    sandbox.reset();
  });
  
  describe("# findByCustomerId", () => {
    it("calls DAOs query method", async () => {
      // arrange
      const id = uuidv4();
      dao.findByCustomerId.resolves([]);
      // act
      const result = await service.findByCustomerId(id);
      // assert
      sandbox.assert.calledOnce(dao.findByCustomerId);
      expect(result).to.deep.equal([]);
    });
  });

});
