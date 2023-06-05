import CouponRepository from "./CouponRepository";

type Output = {
  isValid: boolean;
};

export default class ValidateCoupon {
  constructor(readonly couponRepository: CouponRepository) {}
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
