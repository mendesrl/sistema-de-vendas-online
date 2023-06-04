import Cpf from "./Cpf";
import Item from "./Item";
import Product from "./Product";

export default class Order {
  cpf: Cpf;
  items: Item[];
  constructor(readonly id_order: string, cpf: string) {
    this.cpf = new Cpf(cpf);
    this.items = [];
  }

  addItem(product: Product, qtd: number) {
    if (this.items.some((item) => item.id_product === product.id_product))
      throw new Error("Duplicate item");

    this.items.push(new Item(product.id_product, product.price, qtd));
    return;
  }
  getTotal() {
    let total = 0;
    for (const item of this.items) {
      total += item.getTotal();
    }
    return total;
  }
}
