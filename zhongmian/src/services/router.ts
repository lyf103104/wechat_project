import Taro from '@tarojs/taro';
import * as queryString from 'query-string';

function combineQuery(pageName: string, params: object) {
    return `/pages/${pageName}/index?${queryString.stringify(params)}`;
}

/**
 * 参数仓库
 */
class ParamsStorage {
    private _storage = {};

    /**
     * 根据页面名生成唯一码
     * @param pageName 页面名称
     * @returns {string} 唯一码
     */
    private generateUnique(pageName: string): string {
        const timestamp = new Date().valueOf();
        return pageName + timestamp;
    }
    /**
     * 存储页面参数
     * @param pageName 页面名称
     * @param params 需存储的参数
     * @returns {string} 存储key
     */
    save(pageName: string, params: object = {}): string {
        const key = this.generateUnique(pageName);
        this._storage[key] = params;
        return key;
    }

    /**
     * 读取页面参数
     *
     * 在读取结束后存储的数据会被删除。
     *
     * @param uniqueKey 存储key
     * @returns {object} 被存储的参数
     */
    load<T>(uniqueKey: string): T | null {
        const params = this._storage[uniqueKey];
        if (params) {
            delete this._storage[uniqueKey];
            return params;
        }
        return null;
    }
}

export const ps = new ParamsStorage();

export default {
    navigate: function(pageName: string = 'index', params: object = {}) {
        let url = combineQuery(pageName, {
            $routerParamsStorageKey: ps.save(pageName, params)
        });
        return Taro.navigateTo({
            url
        });
    },
    redirect: function(pageName: string = 'index', params: object = {}) {
        let url = combineQuery(pageName, {
            $routerParamsStorageKey: ps.save(pageName, params)
        });
        return Taro.redirectTo({
            url
        });
    },
    back: function(delta: number = 1) {
        return Taro.navigateBack({ delta });
    },
    /**
     * 获取路由参数
     *
     * 注意参数只会返回一次，请自行保管返回值。
     *
     * @param context 当前页的上下文
     * @example
     * constructor(props) {
     *     super(props);
     *     console.log("params =>", Router.getParams(this));
     * }
     */
    getParams: function<T>(context: any) {
        const storageKey = context.$router.params.$routerParamsStorageKey;
        if (!storageKey) {
            console.log('[Router]: $routerParamsStorageKey不存在');
            return null;
        }
        return ps.load<T>(storageKey);
    }
};
