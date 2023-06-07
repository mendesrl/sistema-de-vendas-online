import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import CouponRepository from "./CouponRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import FreightCalculator from "./FreightCalculator";
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
  total: number;
  freight: number;
};

export default class Checkout {
  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    readonly orderRepository: OrderRepository = new OrderRepositoryDatabase()
  ) {}

  async execute(input: Input): Promise<Output> {
    const sequence = await this.orderRepository.count();
    const order = new Order(input.idOrder, input.cpf, input.date, sequence + 1);
    for (const item of input.items) {
      console.log('dentro do for');
      const product = await this.productRepository.get(item.id_product);
      order.addItem(product, item.qtd);
      order.freight += FreightCalculator.calculate(product) * item.qtd;
    }
    if (input.coupon) {
      const coupon = await this.couponRepository.get(input.coupon);
      if (coupon) {
        order.addCoupon(coupon);
      }
    }
    await this.orderRepository.save(order);
    return {
      freight: order.freight,
      total: order.getTotal(),
    };
  }
}
