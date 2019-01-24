import Taro, { Component } from '@tarojs/taro';
import { ScrollView, View } from '@tarojs/components';
import { IOrderList } from '../../interfaces';
import Order from '../order';
import './index.scss';

interface OrderListProps {
    orders: Array<IOrderList>;
    onRefreshPage: () => void;
    onShowOrderCode: (codeValue: string) => void;
}

export default class OrderList extends Component<OrderListProps, any> {
    static options = { addGlobalClass: true };
    constructor(props) {
        super(props);
    }
    render() {
        const { orders, onRefreshPage, onShowOrderCode } = this.props;

        if (!orders) {
            return;
        }

        const list = orders.map((order) => {
            return (
                <View key={order.orderId}>
                    <View className='hr-fusion' />
                    <View className='hr-fusion' />
                    <Order
                        order={order}
                        onRefreshPage={onRefreshPage}
                        onShowOrderCode={onShowOrderCode}
                    />
                </View>
            );
        });
        return (
            <View>
                {orders && orders.length > 0 ? (
                    <ScrollView scrollY className='order-list'>
                        {list}
                    </ScrollView>
                ) : (
                    <View className='order-empty'>
                        <View className='img-box'>
                            <View className='img' />
                        </View>
                        <View className='text'>暂无订单</View>
                    </View>
                )}
            </View>
        );
    }
}
