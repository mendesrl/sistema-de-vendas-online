import axios from "axios";
import sinon from "sinon";
import Checkout from "../src/Checkout";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import crypto from "crypto";
import GetOrder from "../src/GetOrder";
import Product from "../src/Product";
import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import RepositoryFactory from "../src/RepositoryFactory";
import PgPromiseAdapter from "../src/PgPromisseAdapter";
import DatabaseConnection from "../src/DatabaseConnection";
axios.defaults.validateStatus = () => {
  return true;
};

let checkout: Checkout;
let getOrder: GetOrder;
let repositoryFactory: RepositoryFactory;
let connection: DatabaseConnection; 
beforeEach(async() => {
  connection = new PgPromiseAdapter();
  await connection.connect();
  repositoryFactory = new DatabaseRepositoryFactory(connection);
  checkout = new Checkout(repositoryFactory);
  getOrder = new GetOrder(repositoryFactory);
});

test("shouldn't create new order if CPF is invalid", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-60",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  };

 await expect(() => checkout.execute(input)).rejects.toThrowError("Invalid Cpf");
});

test("Should be calculate an order with 3 products", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  };

  const output = await checkout.execute(input);

  expect(output.total).toBe(6370);
});

test("Should be calculate an order with 3 products with discount coupon valid", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    coupon: "VALE20",
    date: new Date("2023-04-10T10:00:00"),
  };

  const output = await checkout.execute(input);

  expect(output.total).toBe(5152);
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
});

// test("Shouldn't be applied to the order an non-existent coupon", async function () {
//   const idOrder = crypto.randomUUID();
//   const input = {
//     idOrder,
//     cpf: "041.273.711-61",
//     items: [
//       { id_product: 1, qtd: 1 },
//       { id_product: 2, qtd: 1 },
//       { id_product: 3, qtd: 3 },
//     ],
//     coupon: "VALE0",
//     date: new Date("2023-04-10T10:00:00")
//   };

//   expect(() => checkout.execute(input)).rejects.toThrowError("Invalid Coupon");
// });

test("Shouldn't be calculate an order with quantity negative", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 0 }, //5000
      { id_product: 3, qtd: -3 }, //30
    ],
    coupon: "VALE20",
    date: new Date("2023-04-10T10:00:00"),
  };

  await expect(() => checkout.execute(input)).rejects.toThrowError(
    "Invalid quantity"
  );
});

test("Shouldn't be calculate an order with duplicate item", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 1, qtd: 1 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  };

  await expect(() => checkout.execute(input)).rejects.toThrowError("Duplicated Item");
});

test("Should be calculate an order with 3 products with freight minimal", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    from: "88015600",
    to: "22030600",
    date: new Date("2023-04-10T10:00:00"),
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(6370);
});

test("Should be calculate an order with 3 products with freight", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
    ],
    from: "88015600",
    to: "22030600",
    date: new Date("2023-04-10T10:00:00"),
  };

  const output = await checkout.execute(input);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test("Should be calculate an order with 3 products", async function () {
  const idOrder = crypto.randomUUID();
  const productRepositoryStub = sinon
    .stub(ProductRepositoryDatabase.prototype, "get")
    .resolves(new Product(1, "A", 1000, 100, 30, 10, 3));
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [{ id_product: 1, qtd: 1 }],
    date: new Date("2023-04-10T10:00:00"),
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(1030);
  productRepositoryStub.restore();
});

test("Should be calculate an order with 3 products and obtain save", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.total).toBe(6370);
});

test("Should be calculate an order with 3 products and code generate", async function () {
  const orderRepository = repositoryFactory.createOrderRepository();
  await orderRepository.clear();
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.code).toBe("2023000001");
});

test("Should be calculate an order with 3 products and code generate", async function () {
  const orderRepository = repositoryFactory.createOrderRepository();
  await orderRepository.clear();
  await checkout.execute({
    idOrder: crypto.randomUUID(),
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  });
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00"),
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.code).toBe("2023000002");
});

afterEach(async() => {
  await connection.close();
})