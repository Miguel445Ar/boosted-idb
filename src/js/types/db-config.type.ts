export type DBConfig = {
    databaseName: string,
    onBlocked?: (event: IDBVersionChangeEvent) => void
};