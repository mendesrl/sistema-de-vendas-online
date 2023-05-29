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
        const productData = await this.productRepository.get(item.id_product);
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
    return output;
  }
}
