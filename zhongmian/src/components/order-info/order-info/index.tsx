import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { IOrderInfo } from '../../../interfaces';
import './index.scss';

interface OrderProps {
    order: IOrderInfo;
}

export default class OrderInfo extends Component<OrderProps, any> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    render() {
        const { order } = this.props;

        return (
            <View className='order-info'>
                <View className='info-row'>
                    订单编号：
                    <Text className='info-value'>
                        {order.orderdetail_info.order_aliascode}
                    </Text>
                </View>
                <View className='info-row'>
                    订单金额：
                    <Text className='info-value'>
                        ￥{order.orderdetail_info.payablePrice}
                    </Text>
                </View>
                <View className='info-row'>
                    商品数量：
                    <Text className='info-value'>
                        {order.amount.productQuantity}
                    </Text>
                </View>
                <View className='info-row'>
                    订单状态：
                    <Text className='info-value'>
                        {order.orderdetail_info.order_status}
                    </Text>
                </View>
                <View className='info-row'>
                    下单时间：
                    <Text className='info-value'>
                        {order.orderdetail_info.order_creattime}
                    </Text>
                </View>
            </View>
        );
    }
}
