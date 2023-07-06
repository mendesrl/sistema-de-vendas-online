import OrderRepository from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import RepositoryFactory from "./RepositoryFactory";

type Output = {
  total: number,
  code: string;
};

export default class GetOrder {
  orderRepository: OrderRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.orderRepository = repositoryFactory.createOrderRepository();

  }
  async execute(idOrder: string): Promise<Output> {
    const orderData = await this.orderRepository.get(idOrder);
    orderData.total = parseFloat(orderData.total);
    orderData.freight = parseFloat(orderData.freight);
    return orderData;
  }
}
