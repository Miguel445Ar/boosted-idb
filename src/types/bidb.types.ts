import { PrimaryKeyStrategy } from "../enums/primary-key-strategies.enum";

export type BidbDatabase = IDBDatabase;
export type BidbCollectionInfo = { 
    name: string;
    ignoreIfExists: boolean;
    strategy: PrimaryKeyStrategy
};
export type BidbDBConfig = {
    databaseName: string,
    upgradeDatabaseContent: boolean
    collections?: BidbCollectionInfo[]
    onBlocked?: (event: IDBVersionChangeEvent) => void
};
export type BidbDBIndex = IDBIndex;
export type BidbObjectCollection = IDBObjectStore;
export type BidbTransactionMode = IDBTransactionMode;
export type BidbUniqueKey = string | string[] | null;
export type BidbValidKey = IDBValidKey;