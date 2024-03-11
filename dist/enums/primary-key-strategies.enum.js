export class PrimaryKeyStrategy {
    constructor(_keyName, _autoIncrement = false) {
        this._keyName = _keyName;
        this._autoIncrement = _autoIncrement;
    }
    get keyName() {
        return this._keyName;
    }
    toObjectLiteral() {
        return {
            key: this._keyName,
            autoIncrement: this._autoIncrement
        };
    }
}
PrimaryKeyStrategy.AUTOINCREMENT_FIELD_FROM = (keyName) => {
    if (typeof keyName !== 'string') {
        throw new Error(`${keyName === null || keyName === void 0 ? void 0 : keyName.toString()} is not a valid property`);
    }
    return new PrimaryKeyStrategy(keyName, true);
};
PrimaryKeyStrategy.UNIQUE_FIELD_FROM = (keyName) => {
    if (typeof keyName !== 'string') {
        throw new Error(`${keyName === null || keyName === void 0 ? void 0 : keyName.toString()} is not a valid property`);
    }
    return new PrimaryKeyStrategy(keyName);
};
