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

test("should be calculate new order and generate code", function () {
  const id_order = crypto.randomUUID();
  const cpf = "041.273.711-61";
  const order = new Order(id_order, cpf, new Date("2023-03-01T10:00:00"), 1);
  expect(order.code).toBe("2023000001");
});