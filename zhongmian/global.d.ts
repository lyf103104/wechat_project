declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

/**
 * 全局配置项
 *
 * 内容由`defineConstants`提供
 */
declare let GLOBAL_CONFIG: {
    /**
     * 服务器接口地址
     */
    readonly Server: string;
};
