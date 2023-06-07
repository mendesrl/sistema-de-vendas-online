import axios from "axios";
import sinon from "sinon";
import Checkout from "../src/Checkout";
import CouponRepository from "../src/CouponRepository";
import ProductRepository from "../src/ProductRepository";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import crypto from "crypto";
import GetOrder from "../src/GetOrder";
import OrderRepositoryDatabase from "../src/OrderRepositoryDatabase";
import Product from "../src/Product";
import Coupon from "../src/Coupon";
axios.defaults.validateStatus = () => {
  return true;
};

let checkout: Checkout;
let getOrder: GetOrder;
let orderRepository: OrderRepositoryDatabase;

beforeEach(() => {
  const products: any = {
    1: new Product(1, "A", 1000, 100, 30, 10, 3),
    2: new Product(2, "B", 5000, 50, 50, 50, 22),
    3: new Product(3, "C", 30, 10, 10, 10, 0.9),
    4: new Product(4, "D", 30, -10, -10, -10, -1),
  };
  const productRepository: ProductRepository = {
    get: function (id_product: number): Promise<any> {
      return products[id_product];
    },
  };
  const coupons: any = {
    "VALE20": new Coupon("VALE20", 20, new Date("2027-05-10T10:00:00")),
    "VALE10": new Coupon("VALE10", 10, new Date("2023-04-10T10:00:00")),
  };
  const couponRepository: CouponRepository = {
    get: function (code: string): Promise<any> {
      return coupons[code];
    },
  };

  orderRepository = new OrderRepositoryDatabase();
  checkout = new Checkout(productRepository, couponRepository, orderRepository);
  getOrder = new GetOrder(orderRepository);
});

test.only("shouldn't create new order if CPF is invalid", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-60",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00")
  };

  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid Cpf");
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
    date: new Date("2023-04-10T10:00:00")
  };

  const output = await checkout.execute(input);

  expect(output.total).toBe(6090);
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
    date: new Date("2023-04-10T10:00:00")
  };

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
});

test("Shouldn't be applied to the order an non-existent coupon", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    coupon: "VALE0",
    date: new Date("2023-04-10T10:00:00")
  };

  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid Coupon");
});

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
    date: new Date("2023-04-10T10:00:00")
  };

  expect(() => checkout.execute(input)).rejects.toThrowError(
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
    date: new Date("2023-04-10T10:00:00")
  };

  expect(() => checkout.execute(input)).rejects.toThrowError("Duplicated Item");
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
    date: new Date("2023-04-10T10:00:00")
  };

  const output = await checkout.execute(input);
  expect(output.freight).toBe(280);
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
    date: new Date("2023-04-10T10:00:00")
  };

  const output = await checkout.execute(input);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test("Shouldn't be calculate an order with dimensions negatives", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [{ id_product: 4, qtd: 1 }],
    coupon: "VALE20",
    date: new Date("2023-04-10T10:00:00")
  };

  expect(() => checkout.execute(input)).rejects.toThrowError(
    "Invalid dimensions"
  );
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
    date: new Date("2023-04-10T10:00:00")
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(1000);
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
    date: new Date("2023-04-10T10:00:00")
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.total).toBe(6090);
});

test("Should be calculate an order with 3 products and code generate", async function () {
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
    date: new Date("2023-04-10T10:00:00")
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.code).toBe("2023000001");
});

test("Should be calculate an order with 3 products and code generate", async function () {
  await orderRepository.clear();
  await checkout.execute({
    idOrder: crypto.randomUUID(),
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
    date: new Date("2023-04-10T10:00:00")
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
    date: new Date("2023-04-10T10:00:00")
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.code).toBe("2023000002");
});
