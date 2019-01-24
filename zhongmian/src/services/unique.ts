import { StorageService } from '../services';

const STORAGE_KEY = 'unique';

// 将所传入的数字转换为字符串，若字符串的长度小于所指定的长度，则在起始位置以数字 「0」 补足长度。
// 最多支持 5 位补足长度。
function fill(number, length) {
    const filler = '00000';
    let str = number.toString();

    if (str.length < length) {
        str = filler.substring(0, length - str.length) + str;
    }

    return str;
}

// 创建一个标识码
function createUnique() {
    const now = new Date();

    return (
        'weapp-' +
        now.getFullYear() +
        fill(now.getMonth() + 1, 2) +
        fill(now.getDate(), 2) +
        fill(now.getHours(), 2) +
        fill(now.getMinutes(), 2) +
        fill(now.getSeconds(), 2) +
        fill(now.getMilliseconds(), 3) +
        Math.random()
            .toFixed(20)
            .substring(2)
    ); // 20 位随机码
}

class unique {
    private _unique;

    public init() {
        this._unique = StorageService.readSync(STORAGE_KEY);

        if (!this._unique) {
            this._unique = createUnique();
            StorageService.writeSync(STORAGE_KEY, this._unique);
        }
    }

    public get(): Promise<string> {
        return this._unique;
    }

    public clean(): void {
        StorageService.write(STORAGE_KEY, '');
    }
}

export default new unique();
