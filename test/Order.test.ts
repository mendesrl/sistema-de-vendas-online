import axios from "axios";
axios.defaults.validateStatus = () => {
  return true;
};

test("shouldn't create new order if CPF is invalid", async function () {
  const input = {
    cpf: "041.273.711-60",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 1 }, //5000
      { id_product: 3, qtd: 3 }, //30
    ],
  };
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(output.message).toBe("Invalid CPF");
});

test("Should be calculate an order with 3 products", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 1 }, //5000
      { id_product: 3, qtd: 3 }, //30
    ],
  };
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(output.total).toBe(6090);
});

test("Should be calculate an order with 3 products with discount coupon valid", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 1 }, //5000
      { id_product: 3, qtd: 3 }, //30
    ],
    coupon: "VALE20",
  };
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(output.total).toBe(4872);
});

test("Shouldn't be applied to the order an expired discount coupon invalid", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 1 }, //5000
      { id_product: 3, qtd: 3 }, //30
    ],
    coupon: "VALE10",
  };
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(output.message).toBe("Invalid Coupon");
});

test("Shouldn't be applied to the order an non-existent coupon", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 }, //1000
      { id_product: 2, qtd: 1 }, //5000
      { id_product: 3, qtd: 3 }, //30
    ],
    coupon: "VALE0",
  };
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(output.message).toBe("Invalid Coupon");
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
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid quantity");
});

test("Shouldn't be calculate an order with duplicate item", async function () {
  const input = {
    cpf: "041.273.711-61",
    items: [
      { id_product: 1, qtd: 1 },
      { id_product: 1, qtd: 1 },
    ],
  };
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Duplicated Item");
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
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;
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
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;
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
  const response = await axios.post("http://localhost:3001/checkout", input);
  const output = response.data;

  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid dimensions");
});
