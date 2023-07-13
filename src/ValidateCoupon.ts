import CouponRepository from "./CouponRepository";
import RepositoryFactory from "./RepositoryFactory";

type Output = {
  isValid: boolean;
};

export default class ValidateCoupon {
  couponRepository: CouponRepository;
  constructor(repositoryFactory: RepositoryFactory) {
    this.couponRepository = repositoryFactory.createCouponRepository()
  }
  async execute(code: string): Promise<Output> {
    const output = {
      isValid: false,
    };
    const coupon = await this.couponRepository.get(code);
    if(!coupon) return output;
    const today = new Date();
    output.isValid = coupon.isValid(today);
    return output;
  }
}
