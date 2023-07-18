import pgp from "pg-promise";
import DatabaseConnection from "./DatabaseConnection";


// Framework and driver
// Adapter
export default class PgPromiseAdapter implements DatabaseConnection {
    connection: any
    
    async connect(): Promise<void> {
        this.connection = pgp()("postgres://postgres:Postgres2023!@localhost:5432/cccat11");
        
    }
    async query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params)
    }
    async close(): Promise<void> {
        await this.connection.$pool.end();
    }
}

