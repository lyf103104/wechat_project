import { isArray, isString } from 'lodash';

const storeRegex = /.*?[\?\&]cdfgappstore=(\d+).*?$/;

/**
 * 从二维码链接中解析门店信息
 * @param url 二维码链接
 */
export default function(url: string): number | false {
    const matchs = url.match(storeRegex);
    if (!isArray(matchs) || !isString(matchs[1])) {
        return false;
    }
    return parseInt(matchs[1]);
}
