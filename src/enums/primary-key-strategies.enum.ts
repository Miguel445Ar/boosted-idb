import { BidbUniqueKey } from "../types/bidb.types";

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
        return new PrimaryKeyStrategy(keyName, false);
    }

    private constructor(
        private _keyName: BidbUniqueKey,
        private _autoIncrement: boolean
    ) {

    }
    get keyName(): BidbUniqueKey {
        return this._keyName;
    }
    get autoIncremented(): boolean {
        return this._autoIncrement;
    }
    toObjectLiteral(): { autoIncrement?: boolean, keyPath?: BidbUniqueKey } {
        return {
            keyPath: this._keyName,
            autoIncrement: this._autoIncrement
        }
    }
}