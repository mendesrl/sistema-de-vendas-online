import pgp from "pg-promise";
import OrderRepository from "./OrderRepository";
import Order from "./Order";

export default class OrderRepositoryDatabase implements OrderRepository {
  
  async get(idOrder: string): Promise<any> {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    const [orderData] = await connection.query(
      "select * from cccat11.order where id_order = $1",
      [idOrder]
    );
    await connection.$pool.end();
    return orderData;
  }

  async save(order: Order): Promise<void> {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    await connection.query(
      "insert into cccat11.order (id_order, code, cpf, total, freight) values ($1, $2, $3, $4, $5)",
      [order.idOrder, order.code, order.cpf, order.getTotal(), order.freight]
    );
    await connection.$pool.end();
  }

  async clear(): Promise<void> {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    await connection.query("delete from cccat11.order", []);
    await connection.$pool.end();
  }

  async count(): Promise<number> {
    const connection = pgp()(
      "postgres://postgres:Postgres2023!@localhost:5432/cccat11"
    );
    const [data] = await connection.query("select count(*)::integer from cccat11.order", []);
    await connection.$pool.end();
    return data.count;
  }
}
