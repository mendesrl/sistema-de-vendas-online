import pgp from "pg-promise";
import Coupon from "./Coupon";
import CouponRepository from "./CouponRepository";

export default class CouponRepositoryDatabase implements CouponRepository{
  async get(code: string) {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    const [couponData] = await connection.query(
      "select * from cccat11.coupon where code = $1",
      [code]
    );
    await connection.$pool.end();
    return new Coupon(
      couponData.code,
      parseFloat(couponData.percentage),
      couponData.expired
    );
  }
}
