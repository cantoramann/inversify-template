import chai from "chai";
import sinon, { SinonStub } from "sinon";
import DAO from "../gifts/GiftsDAO";
import { v4 as uuidv4 } from "uuid";

const { expect } = chai;
const sandbox = sinon.createSandbox();

// creating an interface is not ideal, but it's necessary due to 
// limitations with stubbing the Objection.Model instance passed to the DAO
// for a better test implementation, see Service.test.ts
interface Methods {
  query: SinonStub<any, Methods>;
  where: SinonStub<any, Methods>;
  findByOwnerId: SinonStub<any, Methods>;
  first: SinonStub<any, Methods>;
}

describe("src :: dao :: gifts :: GiftsDAO", () => {
  let methods: Methods;
  let dao: DAO;

  beforeEach(() => {
    methods = {
      query: sandbox.stub(),
      where: sandbox.stub(),
      findByOwnerId: sandbox.stub(),
      first: sandbox.stub(),
    };

    dao = new DAO(methods as any);
  });

  afterEach(() => {
    sandbox.reset();
  });

  describe("# findByOwnerId", () => {
    it("returns an instance array", async () => {
      // arrange
      const id = uuidv4();

      methods.findByOwnerId.returnsThis();
      methods.query.returnsThis();
      methods.where.onFirstCall().returnsThis();
      methods.where.onSecondCall().returnsThis();
      methods.first.resolves([{ ownerId: id, isClaimed: false }])

      // act
      const result = await dao.findByOwnerId(id);
      // assert
      sandbox.assert.calledTwice(methods.where);
      sandbox.assert.calledOnce(methods.query);
      expect(typeof result == "object").to.be.true;
    });
  });
});
