import FreightCalculator from "./FreightCalculator";
import ProductRepository from "./ProductRepository";

type Input = {
  items: { id_product: number; qtd: number }[];
  from?: string;
  to?: string;
};

type Output = {
  freight: number;
};

export default class SimulateFreight {
  constructor(readonly productRepository: ProductRepository) {}
  async execute(input: Input): Promise<Output> {
    const output = {
      freight: 0,
    };
    for (const item of input.items) {
      if (input.from && input.to) {
        const product = await this.productRepository.get(item.id_product);
        const freight = FreightCalculator.calculate(product);
        output.freight += freight * item.qtd;
      }
    }
    return output;
  }
}

 