import Coupon from "../src/Coupon";

test("Should be able to test coupon is valid", () => {
  const coupon = new Coupon("VALE20", 20, new Date("2027-05-10T10:00:00"));

  expect(coupon.isValid(new Date("2023-05-10T10:00:00"))).toBe(true);
});

test("Should be able to apply disccount", () => {
  const coupon = new Coupon("VALE20", 20, new Date("2027-05-10T10:00:00"));

  expect(coupon.applyCoupon(1000)).toBe(200);
});

test("Shouldn't be able to test coupon is invalid", () => {
  const coupon = new Coupon("VALE10", 10, new Date("2023-04-10T10:00:00"));

  expect(coupon.isValid(new Date("2023-05-10T10:00:00"))).toBe(false);
});
