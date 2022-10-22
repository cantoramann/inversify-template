import chai from "chai";
import sinon, { SinonStubbedInstance } from "sinon";
import DAO from "../../dao/pets/PetsDAO";
import { v4 as uuidv4 } from 'uuid';

// file under test
import Service from "./PetsService";
import PetsDAO from "../../dao/pets/PetsDAO";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("src :: service :: pets :: PetsService", () => {
  // test double variables (stubs))
  let dao: SinonStubbedInstance<PetsDAO>;

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
    dao.findDistinctTypesByOwnerId = sandbox.stub();

    service = new Service(dao);
  });

  afterEach(() => {
    sandbox.restore();
    sandbox.reset();
  });
  describe("# findDistinctTypesByOwnerId", () => {
    it("calls DAOs query method", async () => {
      // arrange
      const id = uuidv4();
      dao.findDistinctTypesByOwnerId.resolves([]);
      // act
      const result = await service.findDistinctTypesByOwnerId(id);
      // assert
      sandbox.assert.calledOnce(dao.findDistinctTypesByOwnerId);
      expect(result).to.deep.equal([]);
    });
  });

});
