import { DBCreator } from "./db-creator";
import { PrimaryKeyStrategy } from "./enums/primary-key-strategies.enum";
import { BaseRepository } from "./repositories/base.repository";
import { Database } from "./types/database.type";

// type Point = { x: number, y: number };

// function main(): void {
//     const element = document.getElementById('canvas');
//     if(element === null) {
//         console.error('Element with id #canvas does not exists');
//         return;
//     }
//     const canvas: HTMLCanvasElement = element as HTMLCanvasElement;
//     const point: Point = {
//         x: 100,
//         y: 100
//     };
//     const context = canvas.getContext("2d");
//     if(context === null) {
//         console.error('Context does not exists in this canvas element')
//         return;
//     }
//     context.beginPath();
//     context.fillStyle = "white";
//     context.strokeStyle = "black";
//     context.arc(point.x, point.y, 10, 0, Math.PI * 2);
//     context.fill();
//     context.stroke();
// }

interface User {
    userId?: string;
    name: string;
    email: string;
}

class UserRepository extends BaseRepository<User> {
    constructor(database: Database) {
        super(database, "users", PrimaryKeyStrategy.AUTOINCREMENT_FIELD_FROM<User>("userId"));
    }
    async getAllUsers(): Promise<User[]> {
        return await this.getAllObjects();
    }
    async addUsers(users: User[]): Promise<IDBValidKey[]> {
        return await this.addAllObjects(users);
    }
}

async function doStuff() {
    const database: Database = await DBCreator.getConnectionFromConfig({
        databaseName: "sample"
    });
    const userRepository: UserRepository = new UserRepository(database);
    const keys: IDBValidKey[] = await userRepository.addUsers([
        { name: "Miguel", email: "mcahuas@zytrust.com" },
        { name: "Juan", email: "juan@hotmail.com" },
        { name: "Ana", email: "ana@hotmail.com" }
    ]);
    console.log(keys);
    const allUsers = await userRepository.getAllUsers();
    console.log(allUsers);
    database.close();
}

function main() {
    doStuff();
}
main();