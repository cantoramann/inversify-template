import chai from "chai";
import sinon, { SinonStubbedInstance } from "sinon";
import DAO from "../../dao/gifts/GiftsDAO";
import { v4 as uuidv4 } from 'uuid';
import Pet from "../../model/Pet";

// file under test
import Service from "./GiftsService";
import GiftsDAO from "../../dao/gifts/GiftsDAO";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("src :: service :: gifts :: GiftsService", () => {
  // test double variables (stubs))
  let dao: SinonStubbedInstance<GiftsDAO>;

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
    dao.findByOwnerId = sandbox.stub();

    service = new Service(dao);
  });

  afterEach(() => {
    sandbox.restore();
    sandbox.reset();
  });
  describe("# findDistinctTypesByOwnerId", () => {
    it("calls DAOs query method", async () => {

      const p = new Pet();
        
      // arrange
      const id = uuidv4();
      dao.findByOwnerId.resolves(p);
      // act
      const result = await service.findByOwnerId(id);
      // assert
      sandbox.assert.calledOnce(dao.findByOwnerId);
      expect(typeof result == 'object').to.be.true;
    });
  });

});
