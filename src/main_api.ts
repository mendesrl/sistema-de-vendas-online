import Checkout from "./Checkout";
import DatabaseRepositoryFactory from "./DatabaseRepositoryFactory";
import ExpressAdapter from "./ExpressAdapter";
import HttpController from "./HttpController";
import PgPromiseAdapter from "./PgPromisseAdapter";

const connection = new PgPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const checkout = new Checkout(repositoryFactory);
const httpServer = new ExpressAdapter();
new HttpController(httpServer, checkout)
httpServer.listen(3001);
