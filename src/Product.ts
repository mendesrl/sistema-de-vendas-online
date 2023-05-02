export default class Product {
  constructor(
    readonly description: string,
    readonly price: string,
    readonly qtd: number
  ) {}

  totalProductValue(price: string, qtd: number) {
    return (parseFloat(price) * qtd);
  }
}
