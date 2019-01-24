import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { IOrderInfo } from '../../../interfaces';
import './index.scss';

interface OrderProps {
    order: IOrderInfo;
}

export default class OrderProducts extends Component<OrderProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const { order } = this.props;

        if (
            !order ||
            !order.orderdetail_productlist ||
            order.orderdetail_productlist.length <= 0
        )
            return;

        return (
            <View className='order-product-list'>
                <View className='info-title'>商品详情</View>
                {order.orderdetail_productlist.map((product) => {
                    return (
                        <View className='product-item' key={product.product_id}>
                            <View className='row'>
                                <View className='col'>
                                    <Text className='product-name'>
                                        {product.pro_name}
                                    </Text>
                                    <View className='row price-and-count'>
                                        <View className='col price'>
                                            <View className='price-label'>
                                                <Text className='price-value'>
                                                    ￥{product.salesPrice.value}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text className='col col-adaptive count'>
                                            x{product.product_amount}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })}
                <View className='order-product-total'>
                    <Text>共</Text>
                    <Text className='text'>{order.amount.productQuantity}</Text>
                    <Text>件商品，订单金额:</Text>
                    <Text className='text'>￥{order.amount.payableAmount}</Text>
                </View>
            </View>
        );
    }
}
