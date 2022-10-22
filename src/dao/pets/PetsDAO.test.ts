import chai from "chai";
import sinon, { SinonStub } from "sinon";
import DAO from "../pets/PetsDAO";
import { v4 as uuidv4 } from "uuid";

const { expect } = chai;
const sandbox = sinon.createSandbox();

// creating an interface is not ideal, but it's necessary due to 
// limitations with stubbing the Objection.Model instance passed to the DAO
// for a better test implementation, see Service.test.ts
interface Methods {
  query: SinonStub<any, Methods>;
  where: SinonStub<any, Methods>;
  distinct: SinonStub<any, Methods>;
  findDistinctTypesByOwnerId: SinonStub<any, Methods>;
}

describe("src :: dao :: pets :: PetsDAO", () => {
  let methods: Methods;
  let dao: DAO;

  beforeEach(() => {
    methods = {
      query: sandbox.stub(),
      where: sandbox.stub(),
      distinct: sandbox.stub(),
      findDistinctTypesByOwnerId: sandbox.stub(),
    };

    dao = new DAO(methods as any);
  });

  afterEach(() => {
    sandbox.reset();
  });
  
  describe("# findDistinctTypesByOwnerId", () => {
    it("returns an instance array", async () => {
      // arrange
      const id = uuidv4();
      methods.query.returnsThis();
      methods.findDistinctTypesByOwnerId.returnsThis();
      methods.distinct.returnsThis();
      methods.where.resolves([{ customerId: id }]);
      // act
      const result = await dao.findDistinctTypesByOwnerId(id);
      // assert
      sandbox.assert.calledOnce(methods.where);
      sandbox.assert.calledOnce(methods.query);
      expect(Array.isArray(result)).to.equal(true);
    });
  });
});