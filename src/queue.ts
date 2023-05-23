import { connect } from "amqplib";
import Checkout from "./Checkout";

async function main() {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("checkout", { durable: true });
  channel.consume("checkout", async (message: any) => {
    const input = JSON.parse(message?.content.toString());
    const checkout = new Checkout();
    try {
      const output = await checkout.execute(input);
      console.log(output);
    } catch (error: any) {
      console.log(error.message);
    }

    channel.ack(message);
  });
}
main();
