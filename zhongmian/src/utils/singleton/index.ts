export default class Singleton {
    private static _instance;

    protected constructor() {}

    static getInstance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
}
