import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import ValidateCoupon from "../src/ValidateCoupon";

test("Should be simulated with valid coupon", async () => {
  const input = "VALE20";
  const couponRepository = new CouponRepositoryDatabase();
  const validateCoupon = new ValidateCoupon(couponRepository);
  const output = await validateCoupon.execute(input);
  expect(output.isValid).toBe(true);
});

test("Shouldn't simulated with invalid coupon", async () => {
    const input = "VALE10";
    const couponRepository = new CouponRepositoryDatabase();
    const validateCoupon = new ValidateCoupon(couponRepository);
    const output = await validateCoupon.execute(input);
    expect(output.isValid).toBe(false);
  });
  
