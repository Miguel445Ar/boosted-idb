import { BidbDatabase } from "../types/bidb.types";

export abstract class CollectionUtils {
    static collectionAlreadyExists(database: BidbDatabase, collectionName: string): boolean {
        return database.objectStoreNames.contains(collectionName);
    }
}