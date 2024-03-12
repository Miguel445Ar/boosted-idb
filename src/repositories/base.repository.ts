import { BidbDBIndex, BidbDatabase, BidbObjectCollection, BidbValidKey } from "../types/bidb.types";

export abstract class BidbRepository<T> {
    private objectCollection?: BidbObjectCollection;
    constructor(
        private readonly dataBase: BidbDatabase,
        private readonly collectionName: string
    ) {
      const collectionAlreadyExists: boolean = this.dataBase.objectStoreNames
        .contains(collectionName);
      if(!collectionAlreadyExists) {
        throw new Error(`Collection with name ${collectionName} does not exists
         in database with name ${dataBase.name}`);
      }
    }
    protected createTransaction(mode: IDBTransactionMode): IDBTransaction {
       return this.dataBase.transaction([this.collectionName], mode);
    }
    protected createIndex<K extends keyof T = keyof T>(
        indexName: K,
        options?: { multiEntry?: boolean, unique?: boolean }
    ): BidbDBIndex {
        if(typeof indexName !== "string") {
            throw new Error("indexName must be string");
        }
        const transaction = this.dataBase.transaction([this.collectionName], "readwrite");
        this.objectCollection = transaction.objectStore(this.collectionName);
        return this.objectCollection.createIndex(indexName, indexName, options);
    }
    protected async addAllObjects(
        objs: T[],
        currentTransaction?: IDBTransaction
    ): Promise<IDBValidKey[]> {
        const transaction: IDBTransaction = 
            currentTransaction ?? this.dataBase.transaction([this.collectionName], 'readwrite');
        this.objectCollection = transaction.objectStore(this.collectionName);
        return Promise.all(objs.map(
            (value: T) => this.addNewObject(value))
        );
    }
    protected async addNewObject(
        obj: T,
        currentTransaction?: IDBTransaction
    ): Promise<IDBValidKey> {
        const transaction: IDBTransaction = 
            currentTransaction ?? this.dataBase.transaction([this.collectionName], 'readwrite');
        this.objectCollection = transaction.objectStore(this.collectionName);
        const request: IDBRequest<IDBValidKey> = this.objectCollection.add(obj);
        return new Promise<IDBValidKey>((resolve, reject) => {
            request.onsuccess = (ev) => {
                resolve(request.result);
            }
            request.onerror = (ev) => {
                reject(new Error(`An error occured while trying to add 
                    an object to the ${this.collectionName} object store.
                    More details: ${request.error}`));
            }
            transaction.onabort = (ev) => {
                reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
            }
        });
    }
    protected async getAllObjects(currentTransaction?: IDBTransaction): Promise<T[]> {
        const transaction: IDBTransaction = 
            currentTransaction ?? this.dataBase.transaction([this.collectionName], 'readonly');
        this.objectCollection = transaction.objectStore(this.collectionName);
        const request: IDBRequest<T[]> = this.objectCollection.getAll();
        return new Promise<T[]>((resolve, reject) => {
            request.onsuccess = (ev) => {
                resolve(request.result);
            };
            request.onerror = (ev) => {
                reject(new Error(`An error occured while trying to get 
                    all objects from the ${this.collectionName} object store.
                    More details: ${request.error}`));
            };
            transaction.onabort = (ev) => {
                reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
            }
        });
    }
    protected async getByCriteria(
        criteria: (obj: T) => boolean,
        currentTransaction?: IDBTransaction
    ): Promise<T[]> {
        const transaction: IDBTransaction = 
            currentTransaction ?? this.dataBase.transaction([this.collectionName], 'readonly');
        this.objectCollection = transaction.objectStore(this.collectionName);
        try {
            const collection: T[] = await this.getAllObjects();
            return collection.filter(criteria);
        }catch(e: Error | any) {
            throw new Error(e);
        }
    }
    protected async getByIndex(
        indexField: string,
        currentTransaction?: IDBTransaction
    ): Promise<T[]> {
        const transaction: IDBTransaction = 
            currentTransaction ?? this.dataBase.transaction([this.collectionName], "readonly");
        this.objectCollection = transaction.objectStore(this.collectionName);
        const index: IDBIndex = this.objectCollection.index(indexField);
        const request: IDBRequest<T[]> = index.getAll();
        return new Promise<T[]>((resolve, reject) => {
            request.onsuccess = (ev) => resolve(request.result);
            request.onerror = (ev) => {
                reject(new Error(`An error occured while trying to get 
                all objects that match with the index ${indexField} from the ${this.collectionName} object store.
                More details: ${request.error}`));
            }
            transaction.onabort = (ev) => {
                reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
            }
        });
    }
    protected async getByUniqueKey(
        key: BidbValidKey,
        currentTransaction?: IDBTransaction
    ): Promise<T | undefined> {
        const transaction: IDBTransaction = 
            currentTransaction ?? this.dataBase.transaction([this.collectionName], "readonly");
        this.objectCollection = transaction.objectStore(this.collectionName);
        const request: IDBRequest<T> = this.objectCollection.get(key);
        return new Promise<T>((resolve, reject) => {
            request.onsuccess = (ev) => {
                resolve(request.result);
            }
            request.onerror = (ev) => {
                reject(new Error(`An error occured while trying to get 
                all objects that match with the key ${key} from the ${this.collectionName} object store.
                More details: ${request.error}`));
            }
            transaction.onabort = (ev) => {
                reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
            }
        });
    }

}