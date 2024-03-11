var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DBCreator {
    static getConnectionFromConfig(config, timeLimitInMilis = 3000) {
        return __awaiter(this, void 0, void 0, function* () {
            const { databaseName, onBlocked } = config;
            const promise = new Promise((resolve, reject) => {
                const connection = indexedDB.open(databaseName);
                connection.onupgradeneeded = (ev) => {
                    console.log("Upgrade needed");
                    resolve(connection.result);
                };
                connection.onsuccess = (event) => {
                    console.log(`Database with name ${databaseName} was created successfully`);
                    resolve(connection.result);
                };
                connection.onerror = (event) => {
                    reject("An error occured while trying to open the database");
                };
                connection.onblocked = onBlocked !== null && onBlocked !== void 0 ? onBlocked : null;
            });
            return Promise.race([promise,
                new Promise((resolve, reject) => setTimeout(() => {
                    reject(new Error("Se excedió el tiempo máximo de espera"));
                }, timeLimitInMilis))
            ]);
        });
    }
}
