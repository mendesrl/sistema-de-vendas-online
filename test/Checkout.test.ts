import axios from "axios";
import Checkout from "../src/Checkout";
axios.defaults.validateStatus = () => {
  return true;
};

test("shouldn't create new order if CPF is invalid", async function () {
  const input = {
    cpf: "041.273.711-60",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
  };
  const checkout = new Checkout();
  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid CPF");
});

test("Should be calculate an order with 3 products", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, 
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
  };
  const checkout = new Checkout();
  const output = await checkout.execute(input);

  expect(output.total).toBe(6090);
});

test("Should be calculate an order with 3 products with discount coupon valid", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    coupon: "VALE20",
  };
  const checkout = new Checkout();
  const output = await checkout.execute(input);

  expect(output.total).toBe(4872);
});

test("Shouldn't be applied to the order an expired discount coupon invalid", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    coupon: "VALE10",
  };
  const checkout = new Checkout();
  
});

test("Shouldn't be applied to the order an non-existent coupon", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    coupon: "VALE0",
  };
  const checkout = new Checkout();
  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid Coupon");
});

test("Shouldn't be calculate an order with quantity negative", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 0 }, //5000
      { id_product: 3, qtd: -3 }, //30
    ],
    coupon: "VALE20",
  };
  const checkout = new Checkout();
  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid quantity");
});

test("Shouldn't be calculate an order with duplicate item", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 1, qtd: 1 },
    ],
  };
  const checkout = new Checkout();
  expect(() => checkout.execute(input)).rejects.toThrowError("Duplicated Item");
});

test("Should be calculate an order with 3 products with freight minimal", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    from: "88015600",
    to: "22030600",
  };
  const checkout = new Checkout();
  const output = await checkout.execute(input);
  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});

test("Should be calculate an order with 3 products with freight", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
    ],
    from: "88015600",
    to: "22030600",
  };
  const checkout = new Checkout();
  const output = await checkout.execute(input);
  expect(output.subtotal).toBe(6000);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test("Shouldn't be calculate an order with dimensions negatives", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [{ id_product: 4, qtd: 1 }],
    coupon: "VALE20",
  };
  const checkout = new Checkout();
  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid dimensions");
});
