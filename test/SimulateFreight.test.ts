import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import SimulateFreight from "../src/SimulateFreight";

test('Should be simulated freight', async () => {
    const input = {
        items: [
          { id_product: 1, qtd: 1 },
          { id_product: 2, qtd: 1 },
          { id_product: 3, qtd: 3 },
        ],
        from: "88015600",
        to: "22030600",
      };
    const repositoryFactory = new DatabaseRepositoryFactory()
    const simulateFreight = new SimulateFreight(repositoryFactory);
    const output = await simulateFreight.execute(input);
    expect(output.freight).toBe(280)
})