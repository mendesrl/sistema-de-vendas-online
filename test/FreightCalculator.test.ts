import FreightCalculator from "../src/FreightCalculator";
import Product from "../src/Product";

test("Should be able to calculate the freight", () => {
  const product = new Product(1, "A",1000,100,30,10,3);
  const freight = FreightCalculator.calculate(product);
  expect(freight).toBe(30);
});

test("Should be able to calculate the minimum freight", () => {
  const product = new Product(1, "A",1000,100,30,10,0.9);
  const freight = FreightCalculator.calculate(product);
  expect(freight).toBe(10);
});
