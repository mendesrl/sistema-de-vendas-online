import pgp from "pg-promise";

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
    return productData;
  }
}
