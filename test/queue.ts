import { connect } from 'amqplib'


// test("Deve fazer um checkout usando a fila", async function () {
//     const connection = await connect("amqp://localhost")
// })

async function main() {
    const connection = await connect("amqp://localhost")
    const channel = await connection.createChannel();

    await channel.assertQueue("checkout", {durable: true});

    const input = {
        cpf: "041.273.711-61",
        items: [
          { id_product: 1, qtd: 1 }, //1000
          { id_product: 2, qtd: 1 }, //5000
          { id_product: 3, qtd: 3 }, //30
        ],
      };

    channel.sendToQueue("checkout", Buffer.from(JSON.stringify(input)));
}
main();