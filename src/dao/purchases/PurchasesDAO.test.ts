import chai from "chai";
import sinon, { SinonStub } from "sinon";
import DAO from "../purchases/PurchasesDAO";
import { v4 as uuidv4 } from "uuid";

const { expect } = chai;
const sandbox = sinon.createSandbox();

// creating an interface is not ideal, but it's necessary due to 
// limitations with stubbing the Objection.Model instance passed to the DAO
// for a better test implementation, see Service.test.ts
interface Methods {
  query: SinonStub<any, Methods>;
  where: SinonStub<any, Methods>;
  findByCustomerIdAndDate: SinonStub<any, Methods>;
}

describe("src :: dao :: purchases :: PurchasesDAO", () => {
  let methods: Methods;
  let dao: DAO;

  beforeEach(() => {
    methods = {
      query: sandbox.stub(),
      where: sandbox.stub(),
      findByCustomerIdAndDate: sandbox.stub(),
    };

    dao = new DAO(methods as any);
  });

  afterEach(() => {
    sandbox.reset();
  });

  describe("# findByCustomerIdAndDate", () => {
    it("returns an instance array", async () => {
      // arrange
      const id = uuidv4();
      const dateFilter = new Date().toDateString();

      methods.query.returnsThis();
      methods.findByCustomerIdAndDate.returnsThis();
      methods.where.onFirstCall().returnsThis();
      methods.where.onSecondCall().resolves([{ customerId: id }]);
      // act
      const result = await dao.findByCustomerIdAndDate(id, dateFilter);
      console.log(result);
      // assert
      sandbox.assert.calledTwice(methods.where);
      sandbox.assert.calledOnce(methods.query);
      expect(Array.isArray(result)).to.equal(true);
    });
  });
});
