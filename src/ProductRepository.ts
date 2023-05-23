export default interface ProductRepository {
    get (id_product: number): Promise<any>;
}