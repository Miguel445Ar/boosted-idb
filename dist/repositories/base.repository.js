var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BaseRepository {
    constructor(dataBase, collectionName, strategy) {
        this.dataBase = dataBase;
        this.collectionName = collectionName;
        const collectionAlreadyExists = this.dataBase.objectStoreNames
            .contains(collectionName);
        if (collectionAlreadyExists) {
            return;
        }
        this.objectCollection = this.dataBase.createObjectStore(collectionName, strategy.toObjectLiteral());
    }
    createTransaction(mode) {
        return this.dataBase.transaction([this.collectionName], mode);
    }
    createIndex(indexName, options) {
        if (typeof indexName !== "string") {
            throw new Error("indexName must be string");
        }
        const transaction = this.dataBase.transaction([this.collectionName], "readwrite");
        this.objectCollection = transaction.objectStore(this.collectionName);
        return this.objectCollection.createIndex(indexName, indexName, options);
    }
    addAllObjects(objs, currentTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = currentTransaction !== null && currentTransaction !== void 0 ? currentTransaction : this.dataBase.transaction([this.collectionName], 'readwrite');
            this.objectCollection = transaction.objectStore(this.collectionName);
            return Promise.all(objs.map((value) => this.addNewObject(value)));
        });
    }
    addNewObject(obj, currentTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = currentTransaction !== null && currentTransaction !== void 0 ? currentTransaction : this.dataBase.transaction([this.collectionName], 'readwrite');
            this.objectCollection = transaction.objectStore(this.collectionName);
            const request = this.objectCollection.add(obj);
            return new Promise((resolve, reject) => {
                request.onsuccess = (ev) => {
                    resolve(request.result);
                };
                request.onerror = (ev) => {
                    reject(new Error(`An error occured while trying to add 
                    an object to the ${this.collectionName} object store.
                    More details: ${request.error}`));
                };
                transaction.onabort = (ev) => {
                    reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
                };
            });
        });
    }
    getAllObjects(currentTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = currentTransaction !== null && currentTransaction !== void 0 ? currentTransaction : this.dataBase.transaction([this.collectionName], 'readonly');
            this.objectCollection = transaction.objectStore(this.collectionName);
            const request = this.objectCollection.getAll();
            return new Promise((resolve, reject) => {
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
                };
            });
        });
    }
    getByCriteria(criteria, currentTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = currentTransaction !== null && currentTransaction !== void 0 ? currentTransaction : this.dataBase.transaction([this.collectionName], 'readonly');
            this.objectCollection = transaction.objectStore(this.collectionName);
            try {
                const collection = yield this.getAllObjects();
                return collection.filter(criteria);
            }
            catch (e) {
                throw new Error(e);
            }
            finally {
                transaction.commit();
            }
        });
    }
    getByIndex(indexField, currentTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = currentTransaction !== null && currentTransaction !== void 0 ? currentTransaction : this.dataBase.transaction([this.collectionName], "readonly");
            this.objectCollection = transaction.objectStore(this.collectionName);
            const index = this.objectCollection.index(indexField);
            const request = index.getAll();
            return new Promise((resolve, reject) => {
                request.onsuccess = (ev) => resolve(request.result);
                request.onerror = (ev) => {
                    reject(new Error(`An error occured while trying to get 
                all objects that match with the index ${indexField} from the ${this.collectionName} object store.
                More details: ${request.error}`));
                };
                transaction.onabort = (ev) => {
                    reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
                };
            });
        });
    }
    getByUniqueKey(key, currentTransaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = currentTransaction !== null && currentTransaction !== void 0 ? currentTransaction : this.dataBase.transaction([this.collectionName], "readonly");
            this.objectCollection = transaction.objectStore(this.collectionName);
            const request = this.objectCollection.get(key);
            return new Promise((resolve, reject) => {
                request.onsuccess = (ev) => {
                    resolve(request.result);
                };
                request.onerror = (ev) => {
                    reject(new Error(`An error occured while trying to get 
                all objects that match with the key ${key} from the ${this.collectionName} object store.
                More details: ${request.error}`));
                };
                transaction.onabort = (ev) => {
                    reject(new Error(`Transaction in ${this.collectionName} object store was aborted`));
                };
            });
        });
    }
}
