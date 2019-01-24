import Taro from '@tarojs/taro';
import { assign, merge, isObject, isString, isEmpty, isNaN } from 'lodash';
import { requestOption } from '../interfaces';

class ApiService {
    requestOptions: requestOption = {
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        }
    };
    _service: string;

    getService(): string {
        return this._service;
    }

    setService(value: string) {
        this._service = value;
    }

    customHeader(headers: object) {
        assign(this.requestOptions.header, headers);
    }

    servieFullPath(path: string): string {
        let purePath = path;
        if (path.startsWith('/')) {
            purePath = path.slice(1);
        }
        return `${this._service}/${purePath}`;
    }

    get<T>(path: string, params: object = {}, config: object = {}) {
        return this.request<T>(path, params, 'GET', config);
    }

    post<T>(path: string, params: object = {}, config: object = {}) {
        return this.request<T>(path, params, 'POST', config);
    }

    put<T>(path: string, params: object = {}, config: object = {}) {
        return this.request<T>(path, params, 'PUT', config);
    }

    delete<T>(path: string, params: object = {}, config: object = {}) {
        return this.request<T>(path, params, 'DELETE', config);
    }

    request<T>(
        url: string,
        params: object,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        config: object
    ) {
        url = this.formatUrlPath(url, params);
        this.formatParams(params);
        let _requestOptions = merge({}, this.requestOptions, config);
        return Taro.request<T>(
            assign({}, _requestOptions, {
                url: this.servieFullPath(url),
                data: params,
                method: method
            })
        );
    }

    /**
     * 格式化参数对象，将空数据从参数对象中移除
     *
     * @param {object} params - 参数对象
     */
    formatParams(params) {
        for (const name in params) {
            let value = params[name];

            if (!this.isValidValue(value)) {
                delete params[name];
            }
        }
    }

    /**
     * 检测参数值是否是有效的，以下参数值将被视为是无效的：
     * - null、undefined
     * - NaN
     * - 长度为 0 的字符串、数组或类数组对象
     * - 自身没有任何可枚举数据的对象
     *
     * @param {*} value 待验证的参数值
     * @return {boolean} 该参数值是否有效
     */
    isValidValue(value) {
        if (isObject(value) || isString(value)) {
            return !isEmpty(value);
        } else {
            return value != null && !isNaN(value);
        }
    }

    /**
     * 格式化 URL 路径部分，将数据插入到 URL 中的占位符中，并将插入的数据从对象中移除
     *
     * @param {string} url - url 地址
     * @param {object} params - 参数对象
     * @return {object} - 格式化之后的 url 地址
     */
    formatUrlPath(url, params) {
        const _formatUrlPath_rfs = /\{([\w.-]+)?\}/;
        const _formatUrlPath_rfg = /\{([\w.-]+)?\}/gm;
        url = url.replace(_formatUrlPath_rfg, function(sn) {
            const mResult = _formatUrlPath_rfs.exec(sn);
            if (mResult) {
                const paramName = mResult[1];
                const val = params[paramName];

                if (val) {
                    delete params[paramName];
                }

                return val == null ? '' : val;
            }
            return '';
        });

        return url;
    }
}
export default new ApiService();
