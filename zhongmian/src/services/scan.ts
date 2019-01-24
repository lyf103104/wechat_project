import Taro from '@tarojs/taro';
import CodeService from './code';
import * as _ from 'lodash';
import { Environment, Birdge } from '../tools';

enum CodeType {
    QRCode = 'qrCode',
    BarCode = 'barCode'
}

class ScanService {
    private async scan(type: Array<CodeType>): Promise<CodeService> {
        let scanResult;
        if (Environment.isWeb) {
            scanResult = await this.scanFromApp();
        } else {
            scanResult = await Taro.scanCode({
                onlyFromCamera: true,
                scanType: type
            });
        }
        return new CodeService(scanResult);
    }

    public async store(): Promise<number> {
        const code = await this.scan([CodeType.QRCode]);
        return code.getStoreId();
    }

    public async product(): Promise<string> {
        const code = await this.scan([CodeType.BarCode]);
        return code.getProductBarCode();
    }

    public async scanAll(): Promise<CodeService> {
        const code = await this.scan([CodeType.BarCode, CodeType.QRCode]);
        return code;
    }

    private scanFromApp(): Promise<any> {
        Birdge.Emmit('scan.code');
        return new Promise((resolve) => {
            Birdge.On(
                'scan.code.result',
                (result) => {
                    // 转编码名
                    // 不是门店就全认为是商品
                    let format =
                        result.format.toLowerCase() == 'qrcode'
                            ? 'QR_CODE'
                            : 'EAN_13';

                    let transResult = {
                        result: result.content,
                        charSet: 'UTF-8',
                        errMsg: 'scanCode:ok',
                        scanType: format
                    };
                    resolve(transResult);
                },
                { once: true }
            );
        });
    }
}

export default new ScanService();
