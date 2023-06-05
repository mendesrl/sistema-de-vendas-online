import pgp from "pg-promise";
import Product from "./Product";

export default class ProductRepositoryDatabase {
  async get(id_product: number) {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    const [productData] = await connection.query(
      "select * from cccat11.product where id_product = $1",
      [id_product]
    );
    await connection.$pool.end();
    return new Product(
      productData.id_product,
      productData.description,
      parseFloat(productData.price),
      productData.width,
      productData.height,
      productData.length,
      parseFloat(productData.weight)
    );
  }
}
