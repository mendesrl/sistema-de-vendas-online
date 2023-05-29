import { ValidateCpf } from "./ValidateCpf";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import CouponRepository from "./CouponRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import ValidateCoupon from "./ValidateCoupon";

type Input = {
  idOrder: string,
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
      if (ValidateCpf(input.cpf)) {
        if (input.items) {
          for (const item of input.items) {
            if (item.qtd <= 0) throw new Error("Invalid quantity");
            if (
              input.items.filter((i: any) => i.id_product === item.id_product)
                .length > 1
            )
              throw new Error("Duplicated Item");

            const productData = await this.productRepository.get(
              item.id_product
            );

            if (
              productData.width <= 0 ||
              productData.height <= 0 ||
              productData.length <= 0 ||
              productData.weight <= 0
            )
              throw new Error("Invalid dimensions");
            const price = parseFloat(productData.price);
            output.subtotal += price * item.qtd;
            if (input.from && input.to) {
              const volume =
                ((((productData.width / 100) * productData.height) / 100) *
                  productData.length) /
                100;
              const density = parseFloat(productData.weight) / volume;
              let freight = volume * 1000 * (density / 100);
              freight = Math.max(10, freight);
              output.freight += freight * item.qtd;
            }
          }
          output.total = output.subtotal;
          if (input.coupon) {
            const couponData = await this.couponRepository.get(input.coupon);

            if (couponData && new ValidateCoupon(couponData.expired)) {
              output.total -=
                (output.total * parseFloat(couponData.percentage)) / 100;
            } else {
              throw new Error("Invalid Coupon");
            }
          }
          output.total += output.freight;
          let sequence = await this.orderRepository.count();
          sequence++;
          const today = new Date();
          const code = `${today.getFullYear()}${new String(sequence).padStart(6,"0")}`;
          const order = {
            code,
            idOrder: input.idOrder,
            cpf: input.cpf,
            total: output.total,
            freight: output.freight,
            items: input.items
          }
          await this.orderRepository.save(order)
          return output;
        }
      } else {
        throw new Error("Invalid CPF");
      }
    } finally {
    }
  }
}
