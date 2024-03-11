import { UniqueKey } from "../types/unique-key.type";

type PropertyOf<T> = keyof T;
type ValidPropertyOf<T, K extends PropertyOf<T>> = T[K] extends Function ? null: K

export class PrimaryKeyStrategy {
    static AUTOINCREMENT_FIELD_FROM = <T, K extends PropertyOf<T> = PropertyOf<T>>(
        keyName: ValidPropertyOf<T,K>
    ) => {
        if(typeof keyName !== 'string') {
            throw new Error(`${keyName?.toString()} is not a valid property`);
        }
        return new PrimaryKeyStrategy(keyName,true)
    }
    static UNIQUE_FIELD_FROM = <T, K extends PropertyOf<T> = PropertyOf<T>>(
        keyName: ValidPropertyOf<T,K>
    ) => {
        if(typeof keyName !== 'string') {
            throw new Error(`${keyName?.toString()} is not a valid property`);
        }
        return new PrimaryKeyStrategy(keyName);
    }

    private constructor(
        private _keyName: UniqueKey,
        private _autoIncrement: boolean = false
    ) {

    }
    get keyName(): UniqueKey {
        return this._keyName;
    }
    toObjectLiteral(): { autoIncrement: boolean, key: UniqueKey } {
        return {
            key: this._keyName,
            autoIncrement: this._autoIncrement
        }
    }
}