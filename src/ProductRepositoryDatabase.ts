import Product from "./Product";
import DatabaseConnection from "./DatabaseConnection";

export default class ProductRepositoryDatabase {
  constructor(readonly connection: DatabaseConnection) {}
  async get(id_product: number) {
    const [productData] = await this.connection.query(
      "select * from cccat11.product where id_product = $1",
      [id_product]
    );

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
