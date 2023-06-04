import Product from "../src/Product";

test("Should be able to calculate the volume", () => {
  const product = new Product(1, "A",1000,100,30,10,3);
  const volume = product.getVolume();
  expect(volume).toBe(0.03);
});

test("Should be able to calculate the density", () => {
    const product = new Product(1, "A",1000,100,30,10,3);
    const density = product.getDensity();
    expect(density).toBe(100);
  });
  