import { ValidateCpf } from "./ValidateCpf";
import pgp from "pg-promise";
import { ValidateCoupon } from "./ValidateCoupon";
import Checkout from "./Checkout";

const input: {
  cpf: string;
  items: { id_product: number; qtd: number }[];
  coupon?: string;
  from?: string;
  to?: string;
} = {
  cpf: "",
  items: [],
};

process.stdin.on("data", async function (data) {
  const command = data.toString().replace(/\n/g, "");
  if (command.startsWith("set-cpf")) {
    input.cpf = command.replace("set-cpf ", "");
    console.log(input);
    return;
  }
  if (command.startsWith("add-item")) {
    const [id_product, qtd] = command.replace("add-item ", "").split(" ");
    input.items.push({ id_product: parseInt(id_product), qtd: parseInt(qtd) });
    console.log(input);
    return;
  }
  if (command.startsWith("checkout")) {
    const checkout = new Checkout();
    try {
      const output = await checkout.execute(input);
      console.log(output);
    } catch (error: any) {
      console.log(error.message);
    }
    return;
  }
  if (command.startsWith("quit")) {
    process.exit();
  }
  console.log("invalid command");
});
