// 二维码
import { isBoolean } from 'lodash';
import StoreUrlAnalyzer from './store-url-analyzer';

export default class CodeService {
    private QRCodeTypes = ['QR_CODE', 'DATA_MATRIX', 'PDF_417', 'WX_CODE'];
    private BarCodeTypes = [
        'AZTEC',
        'CODABAR',
        'CODE_39',
        'CODE_93',
        'CODE_128',
        'EAN_8',
        'EAN_13',
        'ITF',
        'MAXICODE',
        'RSS_14',
        'RSS_EXPANDED',
        'UPC_A',
        'UPC_E',
        'UPC_EAN_EXTENSION',
        'CODE_25'
    ];
    private _code: Taro.scanCode.Promised;
    constructor(scanResult: Taro.scanCode.Promised) {
        this._code = scanResult;
    }

    public isQRCode(): boolean {
        return this.QRCodeTypes.includes(this._code.scanType);
    }

    public isBarCode(): boolean {
        return this.BarCodeTypes.includes(this._code.scanType);
    }

    public getCode(): string {
        if (this.isBarCode()) {
            return this.getProductBarCode();
        } else {
            const storeId = StoreUrlAnalyzer(this._code.result);
            if (isBoolean(storeId)) {
                throw this._code;
            }
            return storeId.toString();
        }
    }

    public isStoreId(): boolean {
        if (!this.isQRCode()) {
            return false;
        }
        const storeId = StoreUrlAnalyzer(this._code.result);
        if (isBoolean(storeId)) {
            return false;
        }
        return true;
    }

    public getStoreId(): number {
        if (!this.isQRCode()) {
            throw this._code;
        }
        const storeId = StoreUrlAnalyzer(this._code.result);
        if (isBoolean(storeId)) {
            throw this._code;
        }
        return storeId;
    }

    public getProductBarCode(): string {
        if (!this.isBarCode()) {
            throw this._code;
        }
        return this._code.result;
    }
}
