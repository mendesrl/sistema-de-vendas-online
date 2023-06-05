export default class Coupon {
  constructor(
    readonly code: string,
    readonly percentage: number,
    readonly expired: Date
  ) {}

  isValid(today: Date) {
    return this.expired.getTime() >= today.getTime();
  }

  applyCoupon(amount: number) {
    return (amount * this.percentage) / 100;
  }
}
