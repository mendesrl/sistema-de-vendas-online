export default class Item {
  constructor(
    readonly id_product: number,
    readonly price: number,
    readonly qtd: number
  ) {
    if (qtd <= 0) throw new Error("Invalid quantity");
  }

  getTotal() {
    return this.price * this.qtd;
  }
}
