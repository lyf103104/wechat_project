import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { isEmpty } from 'lodash';
import { IOrderInfo } from '../../../interfaces';
import './index.scss';

interface OrderProps {
    order: IOrderInfo;
}

export default class OrderAmount extends Component<OrderProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { order } = this.props;
        if (!order || !order.amount) return;
        return (
            <View className='checkout-amount'>
                <View className='checkout-amount-row-title'>
                    <View className='checkout-amount-row'>
                        <Text className='checkout-amount-title'>
                            商品金额：
                        </Text>
                    </View>
                    {order.amount.discountAmount &&
                    !isEmpty(order.amount.discountAmount) ? (
                        <View className='checkout-amount-row'>
                            <Text className='checkout-amount-title'>
                                折扣金额：
                            </Text>
                        </View>
                    ) : (
                        ''
                    )}
                    {order.amount.couponDiscountAmount &&
                    !isEmpty(order.amount.couponDiscountAmount) &&
                    parseFloat(order.amount.couponDiscountAmount) ? (
                        <View className='checkout-amount-row'>
                            <Text className='checkout-amount-title'>
                                代金券：
                            </Text>
                        </View>
                    ) : (
                        ''
                    )}
                    {order.amount.payableAmount &&
                    !isEmpty(order.amount.payableAmount) ? (
                        <View className='checkout-amount-row'>
                            {order.orderdetail_info.statusId == 1 ? (
                                <Text className='checkout-amount-title'>
                                    预付金额：
                                </Text>
                            ) : (
                                <Text className='checkout-amount-title'>
                                    实付金额：
                                </Text>
                            )}
                        </View>
                    ) : (
                        ''
                    )}
                </View>
                <View className='checkout-amount-value'>
                    <View className='checkout-amount-row'>
                        <Text className='amount-value'>
                            ￥{order.amount.productTotalAmount}
                        </Text>
                    </View>
                    {order.amount.discountAmount &&
                    !isEmpty(order.amount.discountAmount) ? (
                        <View className='checkout-amount-row'>
                            <Text className='amount-value'>
                                -￥{order.amount.discountAmount}
                            </Text>
                        </View>
                    ) : (
                        ''
                    )}
                    {order.amount.couponDiscountAmount &&
                    !isEmpty(order.amount.couponDiscountAmount) &&
                    parseFloat(order.amount.couponDiscountAmount) ? (
                        <View className='checkout-amount-row'>
                            <Text className='amount-value'>
                                ￥{order.amount.couponDiscountAmount}
                            </Text>
                        </View>
                    ) : (
                        ''
                    )}
                    {order.amount.payableAmount &&
                    !isEmpty(order.amount.payableAmount) ? (
                        <View className='checkout-amount-row'>
                            <Text className='amount-value'>
                                ￥{order.amount.payableAmount}
                            </Text>
                        </View>
                    ) : (
                        ''
                    )}
                </View>
            </View>
        );
    }
}
