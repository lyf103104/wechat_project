import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtModal, AtModalContent } from 'taro-ui';
import { EventCenter } from '../../constants';
import {
    OrderInfo,
    OrderReceiveInfo,
    OrderProducts,
    OrderAmount,
    CmButton,
    QRCode
} from '../../components';
import { IOrderInfo } from '../../interfaces';
import classnames from 'classnames';
import { SystemInfo } from '../../tools';
import { OrderService, Router, CheckoutService, PaymentService } from '../../services';
import './index.scss';
import _ from 'lodash';

interface orderState {
    /**
     * 订单对象
     */
    order: IOrderInfo;
    /**
     * 提货二维码弹层开关
     */
    openCodeModal: boolean;
    platform: string;
    model: string;
}

export default class Index extends Component<{}, orderState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '订单详情'
    };

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const platform = SystemInfo.getPlatform();
        const model = SystemInfo.getModel();
        this.setState({
            platform,
            model,
            openCodeModal: false
        });
    }

    componentDidMount() {
        this.loadOrder();
    }

    loadOrder = async () => {
        let param = Router.getParams<{ orderId: string }>(this);
        let { order } = this.state;

        let orderId = param
            ? parseInt(param.orderId)
            : order
            ? order.orderid
            : 0;

        let result = await OrderService.getOrderInfo(orderId);

        if (result.statusCode === 200) {
            this.setState({
                order: result.data
            });
        } else {
            Taro.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    payOrder = async () => {
        const { order } = this.state;

        const paymentInfo = await CheckoutService.getPaymentInfo(
            order.orderid.toString()
        );

        try {
            if (
                paymentInfo.statusCode !== 201 ||
                _.isUndefined(paymentInfo.data)
            ) {
                throw paymentInfo.errorMessage
            }

            PaymentService.requestPayment(paymentInfo.data).then(
                function() {
                    Taro.eventCenter.trigger(EventCenter.paySuccess);
                    let payInfo = {
                        orderId: order.orderid,
                        orderNumber: order.orderdetail_info.order_aliascode,
                        payableAmount: order.amount.payableAmount
                    };
                    Router.navigate('payment-success', { payInfo });
                },
                function() {
                    Taro.showToast({
                        title: '支付失败',
                        icon: 'none'
                    });
                }    
            );
        } catch (errorMessage) {
            Taro.showToast({
                title: errorMessage ? errorMessage : '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    cancelOrder = async () => {
        const { order } = this.state;
        await OrderService.cancelOrder(order.orderid);
        this.loadOrder();
    };

    callService = async () => {
        const result = await OrderService.getPlatform();
        if (result.statusCode === 200) {
            Taro.makePhoneCall({ phoneNumber: result.data.servicePhone });
        }
    };

    onShowOrderCode = () => {
        this.setState({
            openCodeModal: true
        });
    };

    onClose = () => {
        this.setState({ openCodeModal: false });
    };

    render() {
        const { order, openCodeModal, platform, model } = this.state;
        if (!order) return;
        let className: string = classnames(
            'order',
            [`platform-${platform}`],
            [`platform-${model}`]
        );
        return (
            <View className={className}>
                <View className='hr-fusion' />
                <View className='hr-fusion' />
                <OrderInfo order={order} />
                <View className='hr-fusion' />
                <View className='hr-fusion' />
                <OrderReceiveInfo order={order} />
                <View className='hr-fusion' />
                <View className='hr-fusion' />
                <OrderProducts order={order} />
                <View className='hr-fusion' />
                <View className='hr-fusion' />
                <View className='order-coupon'>
                    <View>使用代金券</View>
                    <View>
                        {order.orderdetail_info.card_payway ? '是' : '无'}
                    </View>
                </View>
                <View className='hr-fusion' />
                <View className='hr-fusion' />
                <OrderAmount order={order} />
                <View className='fixed-button'>
                    <View className='btn service-btn'>
                        <CmButton
                            type='outline'
                            size='small'
                            onClick={this.callService}
                        >
                            联系客服
                        </CmButton>
                    </View>
                    {order.pay_button ? (
                        <View className='btn service-btn'>
                            <CmButton size='small' onClick={this.payOrder}>
                                立即支付
                            </CmButton>
                        </View>
                    ) : (
                        ''
                    )}
                    {order.cancel_button ? (
                        <View className='btn service-btn'>
                            <CmButton size='small' onClick={this.cancelOrder}>
                                取消订单
                            </CmButton>
                        </View>
                    ) : (
                        ''
                    )}
                    {order.orderNo_button ? (
                        <View className='btn service-btn'>
                            <CmButton
                                size='small'
                                onClick={this.onShowOrderCode}
                            >
                                订单条码
                            </CmButton>
                        </View>
                    ) : (
                        ''
                    )}
                </View>
                <AtModal isOpened={openCodeModal} onClose={this.onClose}>
                    <AtModalContent>
                        {openCodeModal ? (
                            <View className='order-code-box'>
                                <View className='order-code'>
                                    <QRCode
                                        QRid='orderCode'
                                        size={180}
                                        value={order.orderdetail_info.order_aliascode
                                            .toString()
                                            .toLowerCase()}
                                    />
                                </View>
                                <View className='order-title'>订单号：</View>
                                <View>
                                    {order.orderdetail_info.order_aliascode.toString()}
                                </View>
                            </View>
                        ) : (
                            ''
                        )}
                    </AtModalContent>
                </AtModal>
            </View>
        );
    }
}
