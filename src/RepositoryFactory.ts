import CouponRepository from "./CouponRepository";
import OrderRepository from "./OrderRepository";
import ProductRepository from "./ProductRepository";

export default interface RepositoryFactory {
    createOrderRepository (): OrderRepository;
    createProductRepository (): ProductRepository;
    createCouponRepository (): CouponRepository;
}