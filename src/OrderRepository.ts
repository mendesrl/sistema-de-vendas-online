export default interface OrderRepository {
    get (idOrder: string): Promise<any>;
    save (order: any): Promise<void>;
    clear (): Promise<void>;
    count (): Promise<number>;
}