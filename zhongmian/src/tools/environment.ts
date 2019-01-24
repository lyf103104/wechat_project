import isFunction from 'lodash';

export default {
    /**
     * 是否为微信小程序环境
     *
     * 注意这是运行时判断，如果你需要构建时判断请使用 if(process.env.TARO_ENV === 'weapp')
     */
    isWeixin: process.env.TARO_ENV === 'weapp',

    /**
     * 是否为Web环境
     */
    isWeb: process.env.TARO_ENV === 'h5',

    /**
     * 仅在微信小程序环境下执行
     *
     * 注意这是运行时判断，如果你需要构建时判断请使用 if(process.env.TARO_ENV === 'h5')
     *
     * @param fn 执行的方法
     */
    WexinOnly: function(fn: () => void) {
        if (!this.isWeixin || !isFunction(fn)) return;
        fn();
    },

    /**
     * 仅在Web环境下执行
     *
     * @param fn 执行的方法
     */
    WebOnly: function(fn: () => void): void {
        if (!this.isWeb || !isFunction(fn)) return;
        fn();
    }
};
