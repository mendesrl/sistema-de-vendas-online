import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import ValidateCoupon from "../src/ValidateCoupon";

let validateCoupon: ValidateCoupon;

beforeEach(() => {
  const repositoryFactory = new DatabaseRepositoryFactory();
  validateCoupon = new ValidateCoupon(repositoryFactory);
});

test("Should be simulated with valid coupon", async () => {
  const input = "VALE20";
  const couponRepository = new CouponRepositoryDatabase();
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(true);
});

test("Shouldn't simulated with invalid coupon", async () => {
  const input = "VALE10";
  const couponRepository = new CouponRepositoryDatabase();
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(false);
});
