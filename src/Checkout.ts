import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import CouponRepository from "./CouponRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import FreightCalculator from "./FreightCalculator";
import Cpf from "./Cpf";

type Input = {
  idOrder: string;
  cpf: string;
  items: { id_product: number; qtd: number }[];
  coupon?: string;
  from?: string;
  to?: string;
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

    try {
      const cpf = new Cpf(input.cpf);
      if (cpf.ValidateCpf(input.cpf)) {
        const today = new Date();
        if (input.items) {
          for (const item of input.items) {
            if (item.qtd <= 0) throw new Error("Invalid quantity");
            if (
              input.items.filter((i: any) => i.id_product === item.id_product)
                .length > 1
            )
              throw new Error("Duplicated Item");

            const product = await this.productRepository.get(item.id_product);

            if (
              product.width <= 0 ||
              product.height <= 0 ||
              product.length <= 0 ||
              product.weight <= 0
            )
              throw new Error("Invalid dimensions");
            const price = product.price;
            output.subtotal += price * item.qtd;
            if (input.from && input.to) {
              const freight = FreightCalculator.calculate(product);
              output.freight += freight * item.qtd;
            }
          }
          output.total = output.subtotal;
          if (input.coupon) {
            const coupon = await this.couponRepository.get(input.coupon);

            if (coupon && coupon.isValid(today)) {
              output.total -= coupon.applyCoupon(output.total);
            } else {
              throw new Error("Invalid Coupon");
            }
          }
          output.total += output.freight;
          let sequence = await this.orderRepository.count();
          sequence++;

          const code = `${today.getFullYear()}${new String(sequence).padStart(
            6,
            "0"
          )}`;
          const order = {
            code,
            idOrder: input.idOrder,
            cpf: input.cpf,
            total: output.total,
            freight: output.freight,
            items: input.items,
          };
          await this.orderRepository.save(order);
          return output;
        }
      } else {
        throw new Error("Invalid CPF");
      }
    } finally {
    }
  }
}
