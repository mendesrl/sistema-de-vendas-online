import Order from "../src/Order";


test("should be calculate the total value of a product", function () {
  const order = new Order();
  order.addProducts("Banana", "32.25", 2);

  const total = order.totalOrderAmount();
  expect(total).toBe(64.5);
});

test("should be calculate an order with 3 products (with description, price and quantity) and calculate the total value", function () {
  const order = new Order();
  order.addProducts("Banana", "32.00", 2);
  order.addProducts("Avocado", "30.00", 1);
  order.addProducts("Orange", "20.00", 1);

  const total = order.totalOrderAmount();
  expect(total).toBe(114.0);
});

test("should be calculate an order with 3 products must be calculated, associate a discount coupon and calculate the total (percentage of the total order)", function () {
    const order = new Order();
    order.addProducts("Banana", "10.00", 2);
    order.addProducts("Avocado", "40.00", 1);
    order.addProducts("Orange", "10.00", 6);

    const discountCoupon = "30%"

    const totalWithDiscount = order.totalOrderValueWithDiscount(discountCoupon);
    expect(totalWithDiscount).toBe(84);
  });