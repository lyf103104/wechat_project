import Taro from '@tarojs/taro';

class StorageService {
    /**
     * 异步读取数据
     * @param key 存储key
     * @param defaultValue 默认值，如果没取到数据则返回默认值，同时将默认值存储。
     */
    public read<T>(key: string, defaultValue?: T): Promise<T> {
        return Taro.getStorage({
            key
        }).then(
            (res) => {
                // <any>res.data 这种写法不支持
                const result: any = res.data;
                return result;
            },
            () => {
                if (defaultValue != undefined) {
                    this.write(key, defaultValue);
                }
                return defaultValue;
            }
        );
    }

    /**
     * 异步写入数据
     * @param key 存储key
     * @param value 值
     */
    public write(key: string, value: any): Promise<boolean> {
        return Taro.setStorage({
            key,
            data: value
        }).then(
            (res) => {
                return res.errMsg == 'setStorage:ok';
            },
            (err) => {
                console.warn(err);
                return false;
            }
        );
    }

    /**
     * 异步清除数据
     * @param key 存储key
     */
    public remove(key: string): Promise<boolean> {
        return Taro.removeStorage({
            key
        });
    }

    /**
     * 同步读取数据
     * @param key 存储key
     */
    public readSync(key: string): any {
        return Taro.getStorageSync(key);
    }

    /**
     * 同步写入数据
     * @param key 存储key
     * @param value 值
     */
    public writeSync(key: string, value: any): void {
        return Taro.setStorageSync(key, value);
    }

    /**
     * 同步清除数据
     * @param key 存储key
     */
    public removeSync(key: string): void {
        Taro.removeStorageSync(key);
    }
}

export default new StorageService();
