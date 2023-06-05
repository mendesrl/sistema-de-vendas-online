import Order from "../src/Order";
import crypto from "crypto";
import Product from "../src/Product";

test("shouldn't be create the new order with invalid cpf", function () {
  const id_order = crypto.randomUUID();
  const cpf = "000.000.000-00";
  expect(() => new Order(id_order, cpf)).toThrowError("Invalid Cpf");
});

test("should be calculate the new empty order", function () {
  const id_order = crypto.randomUUID();
  const cpf = "041.273.711-61";
  const order = new Order(id_order, cpf);
  expect(order.getTotal()).toBe(0);
});

test("should be calculate an order with 3 products", function () {
  const id_order = crypto.randomUUID();
  const cpf = "041.273.711-61";
  const order = new Order(id_order, cpf);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1),
    order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1),
    order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9), 3),
    expect(order.getTotal()).toBe(6090);
});

test("shouldn't be add duplicated item", function () {
  const id_order = crypto.randomUUID();
  const cpf = "041.273.711-61";
  const order = new Order(id_order, cpf);
  order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1),
    expect(() =>
      order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1)
    ).toThrowError("Duplicate item");
});

// test("should be calculate the total value of a product", function () {
//   const order = new Order();
//   order.addProducts("Banana", "32.25", 2);

//   const total = order.totalOrderAmount();
//   expect(total).toBe(64.5);
// });

// test("should be calculate an order with 3 products (with description, price and quantity) and calculate the total value", function () {
//   const order = new Order();
//   order.addProducts("Banana", "32.00", 2);
//   order.addProducts("Avocado", "30.00", 1);
//   order.addProducts("Orange", "20.00", 1);

//   const total = order.totalOrderAmount();
//   expect(total).toBe(114.0);
// });

// test("should be calculate an order with 3 products must be calculated, associate a discount coupon and calculate the total (percentage of the total order)", function () {
//     const order = new Order();
//     order.addProducts("Banana", "10.00", 2);
//     order.addProducts("Avocado", "40.00", 1);
//     order.addProducts("Orange", "10.00", 6);

//     const discountCoupon = "30%"

//     const totalWithDiscount = order.totalOrderValueWithDiscount(discountCoupon);
//     expect(totalWithDiscount).toBe(84);
//   });
