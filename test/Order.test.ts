import axios from "axios";
import Order from "../src/Order";

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

test("Should be calculate an order with 3 products with discount coupon", async function() {
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

test("Shouldn't be applied to the order an expired discount coupon", async function() {
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

  expect(output.message).toBe('Invalid quantity')
})

test("Shouldn't be calculate an order with duplicate item", async function() {
  
})

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