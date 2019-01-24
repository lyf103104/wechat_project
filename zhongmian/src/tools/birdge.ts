import * as _ from 'lodash';
import Logger from './logger';

const logger = new Logger('WeAppBirdge');
const MessageIdentity = 'BirdgeMessage';

interface IMessage {
    name: string;
    type: string;
    payload: any;
}

interface IOption {
    once: boolean;
}

interface ICallback {
    (payload?: any): void;
}

interface IListner {
    callback: ICallback;
    option: IOption;
}

interface IListnerList {
    [type: string]: Array<IListner>;
}

enum ConnectKeywords {
    SYN = '$.connection.SYN',
    ACK = '$.connection.ACK'
}

class Birdge {
    private _listenerList: IListnerList = {};
    private _inited = false;
    private _connected = false;
    private _runReady;
    private _readyPromise = new Promise((resolve) => {
        this._runReady = resolve;
    });

    /**
     * 当连接成功后
     *
     * @param callback 回调
     * @return promise 连接状态
     */
    onReady(callback?: ICallback) {
        if (_.isFunction(callback)) {
            this._readyPromise.then(() => {
                callback();
            });
        }
        return this._readyPromise;
    }

    get isConnected() {
        return this._connected;
    }

    constructor() {}

    /**
     * 初始化
     */
    init(callback?: ICallback) {
        if (!this._connected && !this._inited) {
            this._inited = true;
            window.addEventListener('message', this.messageHandler.bind(this));
            this.connect();
        }
        return this.onReady(callback);
    }

    private connect() {
        this.post(ConnectKeywords.SYN);
        this.On(ConnectKeywords.ACK, () => {
            this._connected = true;
            logger.info('准备就绪...');
            this._runReady();
        });
    }

    private messageHandler(e) {
        const message: IMessage = e.data;
        if (message.name !== MessageIdentity) return;
        if (_.isUndefined(this._listenerList[message.type])) {
            logger.warn(
                `接收到消息 ${message.type} , 但是没有找到订阅者.`,
                message.payload
            );
        }

        _.forEach(this._listenerList[message.type], function(listener) {
            listener.callback.call(undefined, message.payload);
        });

        _.remove(
            this._listenerList[message.type],
            (listener) => listener.option.once
        );
    }

    private post(type: string, payload?: any) {
        if (window === window.parent) {
            logger.error(`当前并非运行在APP容器下.`);
            return;
        }
        window.parent.postMessage(
            { name: MessageIdentity, type, payload },
            '*'
        );
        // logger.log(`发送消息 ${type}.`, payload);
    }

    /**
     * 注册监听事件
     * @param type 事件类型
     * @param callback 事件发生时的回调
     * @param option 配置选项
     */
    On(type: string, callback: ICallback, option: IOption = { once: false }) {
        if (_.isUndefined(this._listenerList[type])) {
            this._listenerList[type] = [];
        }
        // logger.log(`注册监听 ${type}`);
        const listeners = this._listenerList[type];
        const insertIndex = listeners.push({ callback, option });

        return () => {
            listeners.splice(insertIndex, 1);
        };
    }

    /**
     * 广播事件
     * @param type 事件类型
     * @param payload 数据载荷
     */
    Emmit(type: string, payload?: any) {
        if (!this._connected) {
            logger.warn('没有和APP建立连接');
        }
        this.post(type, payload);
    }
}

export default new Birdge();
