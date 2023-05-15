import Product from "./Product";
import express, { request, Request, Response } from "express";
import { ValidateCpf } from "./ValidateCpf";
import pgp from "pg-promise";
import { ValidateCoupon } from "./ValidateCoupon";

const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
  const connection = pgp()(
    "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
  );
  try {
    if (!ValidateCpf(req.body.cpf)) throw new Error("Invalid CPF");
    const output = {
      subtotal: 0,
      total: 0,
      freight: 0,
    };
    if (req.body.items) {
      for (const item of req.body.items) {
        if (item.qtd <= 0) throw new Error("Invalid quantity");
        if (
          req.body.items.filter((i: any) => i.id_product === item.id_product)
            .length > 1
        )
          throw new Error("Duplicated Item");

        const [productData] = await connection.query(
          "select * from cccat11.product where id_product = $1",
          [item.id_product]
        );
        if (
          productData.width <= 0 ||
          productData.height <= 0 ||
          productData.length <= 0 ||
          productData.weight <= 0
        )
          throw new Error("Invalid dimensions");
        const price = parseFloat(productData.price);
        output.subtotal += price * item.qtd;
        if (req.body.from && req.body.to) {
          const volume =
            ((((productData.width / 100) * productData.height) / 100) *
              productData.length) /
            100;
          const density = parseFloat(productData.weight) / volume;
          let freight = volume * 1000 * (density / 100);
          freight = Math.max(10, freight);
          output.freight += freight * item.qtd;
        }
      }
      output.total = output.subtotal;
      if (req.body.coupon) {
        const [couponData] = await connection.query(
          "select * from cccat11.coupon where code = $1",
          [req.body.coupon]
        );
        if (couponData && ValidateCoupon(couponData.expired)) {
          output.total -=
            (output.total * parseFloat(couponData.percentage)) / 100;
        } else {
          res.json({ message: "Invalid Coupon" });
          return;
        }
      }
      output.total += output.freight;
      res.json(output);
    }
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  } finally {
    await connection.$pool.end();
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
