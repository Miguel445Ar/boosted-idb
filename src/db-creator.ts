import { BidbCollectionInfo, BidbDBConfig, BidbDatabase } from "./types/bidb.types";
import { CollectionUtils } from "./utils/collection-utils";
import { BidbDatabaseInfoUtils } from "./utils/database-utils";

export abstract class DBCreator {
    private static createCollections(
        database: BidbDatabase,
        reject: (reason?: any) => void,
        collections?: BidbCollectionInfo[]
    ): void {
        if(collections === undefined){
            reject(new Error(`Collections must not be undefined`));
            return;
        }
        collections.forEach((collection: BidbCollectionInfo) => {
            const collectionAlreadyExists = CollectionUtils.collectionAlreadyExists(database, collection.name);
            if(collectionAlreadyExists && collection.ignoreIfExists) {
                return;
            }
            if(collectionAlreadyExists) {
                reject(new Error(`Collection with name ${collection.name} already exists`));
                return;
            }
            database.createObjectStore(collection.name, collection.strategy.toObjectLiteral());
        })
    }
    private static async openDb(
        config:  BidbDBConfig,
        version?: number,
        timeLimitInMilis: number = 3000
    ) {
        const { databaseName, onBlocked, collections } = config;
        const promise = new Promise<BidbDatabase>((resolve, reject) => {
            const connection: IDBOpenDBRequest = indexedDB.open(databaseName, version);
            connection.onupgradeneeded = (ev) => {
                const db = connection.result;
                this.createCollections(db, reject, collections);
            }
            connection.onsuccess = (event: Event) => {
                resolve(connection.result);
            }
            connection.onerror = (event: Event) => {
                reject("An error occured while trying to open the database");
            }
            connection.onblocked = onBlocked ?? null;
        });
        return Promise.race<BidbDatabase>([promise, 
            new Promise((resolve, reject) => setTimeout(() => {
                reject(new Error("Database creation time limit exceeded"));
            }, timeLimitInMilis))
        ]);
    }
    static async getConnectionFromConfig(
        config:  BidbDBConfig,
        timeLimitInMilis: number = 3000
    ) /*: Promise<BidbDatabase>*/ {
       const { databaseName, upgradeDatabaseContent } = config;
       const databaseAlreadyExists = await BidbDatabaseInfoUtils.databaseAlreadyExists(databaseName);
       if(!databaseAlreadyExists && !upgradeDatabaseContent) {
           throw new Error(`BidbDBConfig.upgradeDatabaseContent must be true if database does not exists`);
       }
       if((!databaseAlreadyExists && upgradeDatabaseContent) 
            || (databaseAlreadyExists && upgradeDatabaseContent)) {
            let version: number = databaseAlreadyExists ? await BidbDatabaseInfoUtils
                .getDatabaseVersion(databaseName): 0;
            ++version;
            return this.openDb(config, version, timeLimitInMilis);
       }
       return this.openDb(config, undefined, timeLimitInMilis);
    }
}