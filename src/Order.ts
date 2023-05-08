import Product from "./Product";
import express, {Request, Response} from "express";
import { ValidateCpf } from "./ValidateCpf";
import pgp from 'pg-promise'

const app = express();
app.use(express.json());

app.post("/checkout",  async function (req: Request, res: Response) {
  
  if(ValidateCpf(req.body.cpf)) {
    const connection = pgp()("postgres://postgres:Postgres2023!@localhost:5432/cccat11")
    if(req.body.items) {
      for (const item of req.body.items) { 
        const [productData] = await connection.query("select * from cccat11.product where id_product = $1",[item.id_product]);
        console.log(productData)
      }
    }
    res.end();
  }
  else {
    res.json({message: "Invalid CPF"})
  }
})
console.log('ouvindo');
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
    const percent = parseFloat(discount.replace("%", ""))
    let valuePercent = this.totalOrderAmount() * (percent/100);
    var totalWithDiscount = this.totalOrderAmount() - valuePercent;
    return totalWithDiscount;
  }
  
}
