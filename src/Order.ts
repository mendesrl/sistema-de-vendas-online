import Product from "./Product";
import express, { request, Request, Response } from "express";
import { ValidateCpf } from "./ValidateCpf";
import pgp from "pg-promise";
import { ValidateCoupon } from "./ValidateCoupon";
import { ValidateNegativeNumber } from "./ValidateNegativeNumber";

const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
  if (ValidateCpf(req.body.cpf)) {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    const output = {
      total: 0,
    };
    if (req.body.items) {
      for (const item of req.body.items) {
        const [productData] = await connection.query(
          "select * from cccat11.product where id_product = $1",
          [item.id_product]
        );
        const price = parseFloat(productData.price);
        if (ValidateNegativeNumber(item.qtd)) {
          output.total += price * item.qtd;
        } else {
          res.json({ message: "Invalid quantity" });
        }
      }
    }
    if (req.body.coupon) {
      const [couponData] = await connection.query(
        "select * from cccat11.coupon where code = $1",
        [req.body.coupon]
      );
      console.log(ValidateCoupon(couponData.expired));
      if (ValidateCoupon(couponData.expired)) {
        output.total -=
          (output.total * parseFloat(couponData.percentage)) / 100;
      } else {
        res.json({ message: "Invalid Coupon" });
        return;
      }
    }
    res.json(output);
  } else {
    res.json({ message: "Invalid CPF" });
  }
});
console.log("ouvindo");
app.listen(3001);

export default class Order {
  private products: Product[];

  constructor() {
    this.products = [];
  }

  addProducts(description: string, price: string, qtd: number) {
    this.products.push(new Product(description, price, qtd));
  }

  totalOrderAmount() {
    var total = this.products.reduce(getTotal, 0);
    function getTotal(
      total: number,
      item: {
        qtd: number;
        price: string;
      }
    ) {
      return total + parseFloat(item.price) * item.qtd;
    }
    return total;
  }

  totalOrderValueWithDiscount(discount: string) {
    const percent = parseFloat(discount.replace("%", ""));
    let valuePercent = this.totalOrderAmount() * (percent / 100);
    var totalWithDiscount = this.totalOrderAmount() - valuePercent;
    return totalWithDiscount;
  }
}
