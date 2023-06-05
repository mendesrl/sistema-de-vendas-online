import Item from "../src/Item";

test("Should be create a item with invalid quantity", () => {
  expect(() => new Item(1, 1000, -1)).toThrowError("Invalid quantity");
});
