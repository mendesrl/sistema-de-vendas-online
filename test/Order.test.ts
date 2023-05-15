import axios from "axios";
axios.defaults.validateStatus = () => { return true };

test("shouldn't create new order if CPF is invalid", async function() {
  const input = {
    cpf:"041.273.711-00"
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;

  expect(output.message).toBe('Invalid CPF')
})


test("Should be calculate an order with 3 products", async function() {
  const input = {
    cpf:"041.273.711-61",
    items: [
      {id_product: 1, qtd: 1 }, //1000
      {id_product: 2, qtd: 1 }, //5000
      {id_product: 3, qtd: 3 } //30
    ]
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;

  expect(output.total).toBe(6090)
})

test("Should be calculate an order with 3 products with discount coupon valid", async function() {
  const input = {
    cpf:"041.273.711-61",
    items: [
      {id_product: 1, qtd: 1 }, //1000
      {id_product: 2, qtd: 1 }, //5000
      {id_product: 3, qtd: 3 } //30
    ],
    coupon: "VALE20"
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;

  expect(output.total).toBe(4872)
})

test("Shouldn't be applied to the order an expired discount coupon invalid", async function() {
  const input = {
    cpf:"041.273.711-61",
    items: [
      {id_product: 1, qtd: 1 }, //1000
      {id_product: 2, qtd: 1 }, //5000
      {id_product: 3, qtd: 3 } //30
    ],
    coupon: "VALE10"
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;

  expect(output.message).toBe('Invalid Coupon')
})

test("Shouldn't be applied to the order an non-existent coupon", async function() {
  const input = {
    cpf:"041.273.711-61",
    items: [
      {id_product: 1, qtd: 1 }, //1000
      {id_product: 2, qtd: 1 }, //5000
      {id_product: 3, qtd: 3 } //30
    ],
    coupon: "VALE0"
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;

  expect(output.message).toBe('Invalid Coupon')
})

test("Shouldn't be calculate an order with quantity negative", async function() {
  const input = {
    cpf:"041.273.711-61",
    items: [
      {id_product: 1, qtd: 1 }, //1000
      {id_product: 2, qtd: 0 }, //5000
      {id_product: 3, qtd: -3 } //30
    ],
    coupon: "VALE20"
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;

  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid quantity")
})

test("Shouldn't be calculate an order with duplicate item", async function() {
  const input = {
    cpf:"041.273.711-61",
    items: [
      {id_product: 1, qtd: 1 },
      {id_product: 1, qtd: 1 },
    ],
  }
  const response = await axios.post('http://localhost:3001/checkout', input)
  const output= response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Duplicated Item")
})

