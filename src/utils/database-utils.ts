export abstract class BidbDatabaseInfoUtils {
    static async databaseAlreadyExists(databaseName: string): Promise<boolean> {
        const databasesInfo: IDBDatabaseInfo[] = await indexedDB.databases();
        const databaseInfo: IDBDatabaseInfo | undefined = databasesInfo.find(
            databaseInfo => databaseInfo.name === databaseName
        );
        return databaseInfo !== undefined;
    }
    static async getDatabaseVersion(databaseName: string): Promise<number> {
        const databasesInfo: IDBDatabaseInfo[] = await indexedDB.databases();
        const databaseInfo: IDBDatabaseInfo | undefined = databasesInfo.find(
            databaseInfo => databaseInfo.name === databaseName
        );
        const databaseAlreadyExists = databaseInfo !== undefined;
        if(!databaseAlreadyExists) {
            throw new Error(`Database with name ${databaseName} does not exists`);
        }
        return databaseInfo.version as number;
    }
}