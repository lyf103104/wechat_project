import Taro from '@tarojs/taro';

interface ISystemInfoStruct {
    platform: string;
    model: string;
    brand: string;
    system: string;
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    version: string;
    statusBarHeight: number;
    language: string;
    fontSizeSetting: number;
    SDKVersion: string;
}

class SystemInfo {
    private _systemInfo: ISystemInfoStruct;

    constructor() {
        this._systemInfo = Taro.getSystemInfoSync();
    }
    public getPlatform(): string {
        return this._systemInfo.platform.toLowerCase().replace(' ', '-');
    }

    public getModel(): string {
        return this._systemInfo.model.toLowerCase().replace(' ', '-');
    }
}

export default new SystemInfo();
