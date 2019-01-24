import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { IOrderList } from '../../interfaces';
import { OrderService, Router, CheckoutService, PaymentService } from '../../services';
import CmButton from '../cm-button';
import { EventCenter } from '../../constants';
import './index.scss';
import _ from 'lodash';

interface OrderProps {
    order: IOrderList;
    onRefreshPage: () => void;
    onShowOrderCode: (codeValue: string) => void;
}

export default class Order extends Component<OrderProps, any> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    payOrder = async () => {
        const { order } = this.props;

        const paymentInfo = await CheckoutService.getPaymentInfo(
            order.orderId.toString()
        );

        try {
            if (
                paymentInfo.statusCode !== 201 ||
                _.isUndefined(paymentInfo.data)
            ) {
                throw paymentInfo.errorMessage
            }

            PaymentService.requestPayment(paymentInfo.data).then(
                () => {
                    Taro.eventCenter.trigger(EventCenter.orderlistPaySuccess);
                    let payInfo = {
                        orderId: order.orderId,
                        orderNumber: order.showid,
                        payableAmount: order.payablePrice
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
        const { order, onRefreshPage } = this.props;
        await OrderService.cancelOrder(order.orderId);
        onRefreshPage && onRefreshPage();
    };

    toOrderInfo = () => {
        const { order } = this.props;
        Router.navigate('order', { orderId: order.orderId });
    };

    onShowOrderCode = () => {
        const { order, onShowOrderCode } = this.props;
        onShowOrderCode && onShowOrderCode(order.showid);
    };

    callService = async () => {
        const result = await OrderService.getPlatform();
        if (result.statusCode === 200) {
            Taro.makePhoneCall({ phoneNumber: result.data.servicePhone });
        }
    };

    render() {
        const { order } = this.props;

        return (
            <View className='order-item'>
                <View className='header-info' onClick={this.toOrderInfo}>
                    <View className='header-left'>
                        <View className='site-icon cm-icon icon-shopping' />
                        <Text className='sub-site-name'>
                            {order.subSiteName}
                        </Text>
                    </View>
                    <View className='status'>{order.status}</View>
                </View>
                <View className='order-content' onClick={this.toOrderInfo}>
                    <View className='order-showid'>
                        <Text className='text'>订单号：{order.showid}</Text>
                    </View>
                    <View className='order-total'>
                        共<Text className='text'>{order.count}</Text>{' '}
                        件商品，订单金额：
                        <Text className='text'>￥{order.payablePrice}</Text>
                    </View>
                    <View className='icon-arrow cm-icon icon-arrow-right-outline-black' />
                </View>
                <View className='order-bottom'>
                    <View className='button-box'>
                        <View className='btn'>
                            <CmButton
                                type='outline'
                                size='small'
                                onClick={this.callService}
                            >
                                联系客服
                            </CmButton>
                        </View>
                        {order.orderNo_button ? (
                            <View className='btn'>
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
                        {order.payorder ? (
                            <View className='btn'>
                                <CmButton size='small' onClick={this.payOrder}>
                                    立即支付
                                </CmButton>
                            </View>
                        ) : (
                            ''
                        )}
                        {order.cancelorder ? (
                            <View className='btn'>
                                <CmButton
                                    size='small'
                                    onClick={this.cancelOrder}
                                >
                                    取消订单
                                </CmButton>
                            </View>
                        ) : (
                            ''
                        )}
                    </View>
                </View>
            </View>
        );
    }
}
