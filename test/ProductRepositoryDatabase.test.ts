import PgPromiseAdapter from "../src/PgPromisseAdapter";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";

test("Deve obter um produto do banco de dados", async function () {
    const connection = new PgPromiseAdapter();
    await connection.connect();
    const productRepository = new ProductRepositoryDatabase(connection);
    const productData = await productRepository.get(1);
    expect(productData.price).toBe(1000);
    await connection.close();
})

