import Product from "./Product";

export default class Order {
  private products: Product[];

  constructor() {
    this.products = [];
  }

  addProducts(description: string, price: string, qtd: number) {
    this.products.push(new Product(description, price, qtd));
  }

  totalOrderAmount() {
    var total = this.products.reduce(getTotal, 0);
    function getTotal(
      total: number,
      item: {
        qtd: number;
        price: string;
      }
    ) {
      return total + parseFloat(item.price) * item.qtd;
    }
    return total;
  }

  totalOrderValueWithDiscount(discount: string) {
    const percent = parseFloat(discount.replace("%", ""))
    let valuePercent = this.totalOrderAmount() * (percent/100);
    var totalWithDiscount = this.totalOrderAmount() - valuePercent;
    return totalWithDiscount;
  }
  
}
