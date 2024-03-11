import { DBConfig } from "./types/db-config.type";
import { Database } from "./types/database.type";

export abstract class DBCreator {
    static async getConnectionFromConfig(
        config:  DBConfig,
        timeLimitInMilis: number = 3000
    ): Promise<Database> {
        const { databaseName, onBlocked } = config;
        const promise = new Promise<Database>((resolve, reject) => {
            const connection: IDBOpenDBRequest = indexedDB.open(databaseName);
            connection.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
                console.log("Upgrade needed");
                resolve(connection.result);
            }
            connection.onsuccess = (event: Event) => {
                console.log(`Database with name ${databaseName} was created successfully`);
                resolve(connection.result);
            }
            connection.onerror = (event: Event) => {
                reject("An error occured while trying to open the database");
            }
            connection.onblocked = onBlocked ?? null;
        });
        return Promise.race<Database>([promise, 
            new Promise((resolve, reject) => setTimeout(() => {
                reject(new Error("Se excedió el tiempo máximo de espera"));
            }, timeLimitInMilis))
        ]);
    }
}