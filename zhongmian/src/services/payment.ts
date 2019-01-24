import Taro from '@tarojs/taro';
import { IPayment } from 'src/interfaces';

class PaymentService {
    public requestPayment(paymentData: IPayment): Promise<any> {
        return Taro.requestPayment(paymentData);
    }
}

export default new PaymentService();
