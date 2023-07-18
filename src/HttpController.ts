import Checkout from "./Checkout";
import HttpServer from "./HttpServer";
//Interface adapter com framework driver
export default class HttpController {
  constructor(readonly httpServer: HttpServer, readonly checkout: Checkout) {
    httpServer.on("post", "/checkout", async function (params: any, body: any) {
        const output = await checkout.execute(body);
        return output;
    });
  }
}
