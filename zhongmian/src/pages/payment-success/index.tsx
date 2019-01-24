import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { CmButton, QRCode } from '../../components';
import './index.scss';
import { Router } from '../../services';

interface PaymentPageParam {
    payInfo: {
        orderId: number;
        orderNumber: string;
        payableAmount: string;
    };
}

interface PaymentPageState {
    payInfo: {
        orderId: number;
        orderNumber: string;
        payableAmount: string;
    };
}

export default class Index extends Component<any, PaymentPageState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '支付成功'
    };
    constructor(props) {
        super(props);

        const pageParams = Router.getParams<PaymentPageParam>(this);

        let payInfo =
            pageParams && pageParams.payInfo ? pageParams.payInfo : null;
        if (payInfo) {
            this.state = { payInfo: payInfo };
        }
    }

    toIndex = () => {
        Router.redirect('index');
    };

    toOrders = () => {
        Router.redirect('orders');
    };

    render() {
        const { payInfo } = this.state;

        if (!payInfo) return;
        return (
            <View className='payment-success'>
                <View className='order-info'>
                    <View className='info-wrap'>
                        <Text className='info-name'>订单编号：</Text>
                        <Text>{payInfo.orderNumber}</Text>
                    </View>
                    <View className='info-wrap'>
                        <Text className='info-name'>支付金额：</Text>
                        <Text>¥{payInfo.payableAmount}元</Text>
                    </View>
                </View>
                <View className='tip-title'>凭此码核验离开</View>
                <View className='tips-box'>
                    <Text className='cm-icon icon-circle' />
                    <Text className='sub-tips-text'>离店前请勿关闭此页面</Text>
                </View>
                <View className='code-img-box'>
                    {payInfo.orderNumber ? (
                        <QRCode
                            QRid='orderQRCode'
                            value={payInfo.orderNumber.toString().toLowerCase()}
                            size={182}
                        />
                    ) : (
                        ''
                    )}
                </View>
                <View className='close-tip'>
                    如果关闭，您可以在『订单详情』中再次打开
                </View>
                <View className='bottom-buttons'>
                    <View className='bottom-button'>
                        <CmButton type='text' onClick={this.toIndex}>
                            回首页
                        </CmButton>
                    </View>
                    <Text className='separate-line' />
                    <View className='bottom-button'>
                        <CmButton type='text' onClick={this.toOrders}>
                            自助购订单
                        </CmButton>
                    </View>
                </View>
            </View>
        );
    }
}
