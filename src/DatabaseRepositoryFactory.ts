import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import DatabaseConnection from "./DatabaseConnection";
import OrderRepository from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import RepositoryFactory from "./RepositoryFactory";

export default class DatabaseRepositoryFactory implements RepositoryFactory {
    constructor(readonly connection: DatabaseConnection) {}
    createOrderRepository(): OrderRepository {
        return new OrderRepositoryDatabase(this.connection);
    }
    createProductRepository(): ProductRepository {
       return new ProductRepositoryDatabase(this.connection);
    }
    createCouponRepository(): CouponRepository {
        return new CouponRepositoryDatabase(this.connection);
    }
    
}