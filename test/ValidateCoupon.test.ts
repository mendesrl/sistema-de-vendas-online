import DatabaseConnection from "../src/DatabaseConnection";
import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import PgPromiseAdapter from "../src/PgPromisseAdapter";
import ValidateCoupon from "../src/ValidateCoupon";

let validateCoupon: ValidateCoupon;
let connection: DatabaseConnection;
beforeEach(async () => {
  connection = new PgPromiseAdapter();
  await connection.connect();
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  validateCoupon = new ValidateCoupon(repositoryFactory);
});

test("Should be simulated with valid coupon", async () => {
  const input = "VALE20";
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(true);
});

test("Shouldn't simulated with invalid coupon", async () => {
  const input = "VALE10";
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(false);
});

afterEach(async () => {
  await connection.close();
});
