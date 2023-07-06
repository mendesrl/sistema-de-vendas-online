import Coupon from "./Coupon";
import Cpf from "./Cpf";
import Item from "./Item";
import Product from "./Product";

export default class Order {
  cpf: Cpf;
  items: Item[];
  code: string;
  freight: number = 0;
  coupon?: Coupon;

  constructor(
    readonly id_order: string,
    cpf: string,
    readonly date: Date = new Date,
    sequence: number = 1
  ) {
    this.cpf = new Cpf(cpf);
    this.items = [];
    this.code = `${date.getFullYear()}${new String(sequence).padStart(
      6,
      "0"
    )}`;
  }

  addItem(product: Product, qtd: number) {
    if (this.items.some((item) => item.id_product === product.id_product))
      throw new Error("Duplicated Item");

    this.items.push(new Item(product.id_product, product.price, qtd));
    return;
  }
  getTotal() {
    let total = 0;
    for (const item of this.items) {
      total += item.getTotal();
    }
    if(this.coupon) {
      total -= this.coupon.applyCoupon(total)
    }
    total += this.freight;
    return total;
  }
  addCoupon(coupon: Coupon) {
    if(coupon.isValid(this.date)) this.coupon = coupon;
  }
}
