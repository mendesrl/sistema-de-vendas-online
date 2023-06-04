import Product from "./Product";

export default interface ProductRepository {
    get (id_product: number): Promise<Product>;
}