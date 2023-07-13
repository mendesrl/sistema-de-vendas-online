import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import RepositoryFactory from "./RepositoryFactory";

export default class DatabaseRepositoryFactory implements RepositoryFactory {
    createOrderRepository(): OrderRepository {
        return new OrderRepositoryDatabase();
    }
    createProductRepository(): ProductRepository {
       return new ProductRepositoryDatabase();
    }
    createCouponRepository(): CouponRepository {
        return new CouponRepositoryDatabase();
    }
    
}