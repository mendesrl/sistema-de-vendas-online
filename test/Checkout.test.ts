import axios from "axios";
import sinon from "sinon";
import Checkout from "../src/Checkout";
import CouponRepository from "../src/CouponRepository";
import ProductRepository from "../src/ProductRepository";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import crypto from "crypto";
import GetOrder from "../src/GetOrder";
import OrderRepositoryDatabase from "../src/OrderRepositoryDatabase";
axios.defaults.validateStatus = () => {
  return true;
};

let checkout: Checkout;
let getOrder: GetOrder;
let orderRepository: OrderRepositoryDatabase;

beforeEach(() => {
  const products: any = {
    1: {
      id_product: 1,
      description: "A",
      price: 1000,
      width: 100,
      height: 30,
      length: 10,
      weight: 3,
    },
    2: {
      id_product: 2,
      description: "B",
      price: 5000,
      width: 50,
      height: 50,
      length: 50,
      weight: 22,
    },
    3: {
      id_product: 3,
      description: "C",
      price: 30,
      width: 10,
      height: 10,
      length: 10,
      weight: 0.9,
    },
    4: {
      id_product: 4,
      description: "D",
      price: 30,
      width: -10,
      height: -10,
      length: -10,
      weight: -1,
    },
  };
  const productRepository: ProductRepository = {
    get: function (id_product: number): Promise<any> {
      return products[id_product];
    },
  };
  const coupons: any = {
    VALE20: {
      percentage: 20,
      expired: new Date("2027-05-10T10:00:00"),
    },
    VALE10: {
      percentage: 10,
      expired: "2023-04-10T10:00:00",
    },
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

test.skip("shouldn't create new order if CPF is invalid", async function () {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: "041.273.711-60",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
  };

  expect(() => checkout.execute(input)).rejects.toThrowError("Invalid CPF");
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
  };

  const output = await checkout.execute(input);
  expect(output.subtotal).toBe(6090);
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
  };

  const output = await checkout.execute(input);
  expect(output.subtotal).toBe(6000);
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
  };

  expect(() => checkout.execute(input)).rejects.toThrowError(
    "Invalid dimensions"
  );
});

test("Should be calculate an order with 3 products", async function () {
  const idOrder = crypto.randomUUID();
  const productRepositoryStub = sinon
    .stub(ProductRepositoryDatabase.prototype, "get")
    .resolves({
      id_product: 1,
      description: "A",
      price: 1000,
    });
  const input = {
    idOrder,
    cpf: "041.273.711-61",
    items: [{ id_product: 1, qtd: 1 }],
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
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.code).toBe("2023000001");
});

test.only("Should be calculate an order with 3 products and code generate", async function () {
  await orderRepository.clear();
  await checkout.execute({
    idOrder: crypto.randomUUID(),
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 2, qtd: 1 },
      { id_product: 3, qtd: 3 },
    ],
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
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.code).toBe("2023000002");
});
