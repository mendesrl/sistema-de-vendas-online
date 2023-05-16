import { connect } from "amqplib";
import { ValidateCpf } from "./ValidateCpf";
import pgp from "pg-promise";
import { ValidateCoupon } from "./ValidateCoupon";

async function main() {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("checkout", { durable: true });
  channel.consume("checkout", async (message: any)=> {
    const input = JSON.parse(message?.content.toString());

    const connection = pgp()(
        "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
      );
      try {
        if (!ValidateCpf(input.cpf)) throw new Error("Invalid CPF");
        const output = {
          subtotal: 0,
          total: 0,
          freight: 0,
        };
        if (input.items) {
          for (const item of input.items) {
            if (item.qtd <= 0) throw new Error("Invalid quantity");
            if (
              input.items.filter((i: any) => i.id_product === item.id_product)
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
            if (input.from && input.to) {
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
          if (input.coupon) {
            const [couponData] = await connection.query(
              "select * from cccat11.coupon where code = $1",
              [input.coupon]
            );
            if (!(couponData && ValidateCoupon(couponData.expired)))
              output.total -=
                (output.total * parseFloat(couponData.percentage)) / 100;
            throw new Error("Invalid Coupon");
          }
          output.total += output.freight;
          console.log(`Total: ${output.total}`);
        }
      } catch (error: any) {
        console.log(error.message);
      } finally {
        await connection.$pool.end();
      }

    channel.ack(message);
  });
}
main();
