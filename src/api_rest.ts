import express, { Request, Response } from "express";
import Checkout from "./Checkout";

const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
 const checkout = new Checkout();
 try {

  const output = await checkout.execute(req.body);
  res.json(output);
  
 } catch (error: any) {
  res.status(422).json({message: error.message});
 }
});
app.listen(3001);