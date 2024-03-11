var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DBCreator } from "./db-creator";
import { PrimaryKeyStrategy } from "./enums/primary-key-strategies.enum";
import { BaseRepository } from "./repositories/base.repository";
class UserRepository extends BaseRepository {
    constructor(database) {
        super(database, "users", PrimaryKeyStrategy.AUTOINCREMENT_FIELD_FROM("userId"));
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllObjects();
        });
    }
    addUsers(users) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.addAllObjects(users);
        });
    }
}
function doStuff() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield DBCreator.getConnectionFromConfig({
            databaseName: "sample"
        });
        const userRepository = new UserRepository(database);
        const keys = yield userRepository.addUsers([
            { name: "Miguel", email: "mcahuas@zytrust.com" },
            { name: "Juan", email: "juan@hotmail.com" },
            { name: "Ana", email: "ana@hotmail.com" }
        ]);
        console.log(keys);
        const allUsers = yield userRepository.getAllUsers();
        console.log(allUsers);
        database.close();
    });
}
function main() {
    doStuff();
}
main();
