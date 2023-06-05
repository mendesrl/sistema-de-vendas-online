import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import CouponRepository from "./CouponRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import FreightCalculator from "./FreightCalculator";
import Cpf from "./Cpf";
import Order from "./Order";

type Input = {
  idOrder: string;
  cpf: string;
  items: { id_product: number; qtd: number }[];
  coupon?: string;
  from?: string;
  to?: string;
  date: Date;
};

type Output = {
  subtotal: number;
  total: number;
  freight: number;
};

export default class Checkout {
  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()
  ) {}

  async execute(input: Input): Promise<Output | any> {
    const output = {
      subtotal: 0,
      total: 0,
      freight: 0,
    };
    const sequence = await this.orderRepository.count();
    let total = 0;
    const order = new Order(input.idOrder, input.cpf, input.date, sequence + 1);
    for (const item of input.items) {
      const product = await this.productRepository.get(item.id_product);
      order.addItem(product, item.qtd);
      order.freight += FreightCalculator.calculate(product) * item.qtd;
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.get(input.coupon);
      if(coupon && coupon.isValid(input.date || new Date())) {
        output.total -= coupon.applyCoupon(output.total)
      }
    }
    await this.orderRepository.save(order);
    return output;
  }
}
