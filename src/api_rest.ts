import express, { Request, Response } from "express";
import Checkout from "./Checkout";
import DatabaseRepositoryFactory from "./DatabaseRepositoryFactory";

const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
  const repositoryFactory = new DatabaseRepositoryFactory();
  const checkout = new Checkout(repositoryFactory);
  try {
    const output = await checkout.execute(req.body);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});
app.listen(3001);