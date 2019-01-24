export default class Logger {
    private _name;
    constructor(name: string) {
        this._name = name;
    }

    private callOrginal(method: string, content: string, args) {
        return console[method](`${this.LogName} ${content}`, ...args);
    }

    get LogName() {
        return `[${this._name}]`;
    }

    log(content: string, ...args) {
        this.callOrginal('log', content, args);
    }

    warn(content: string, ...args) {
        this.callOrginal('warn', content, args);
    }

    error(content: string, ...args) {
        this.callOrginal('error', content, args);
    }

    info(content: string, ...args) {
        this.callOrginal('info', content, args);
    }
}
