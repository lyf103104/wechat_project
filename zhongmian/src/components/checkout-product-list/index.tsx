import Taro, { Component } from '@tarojs/taro';
import { ScrollView, View, Text } from '@tarojs/components';
import { IProduct } from '../../interfaces';
import './index.scss';

interface ICheckoutProduct extends IProduct {
    amount: number;
}
interface CheckoutProductListProps {
    productList: [ICheckoutProduct];
}

export default class CheckoutProductList extends Component<
    CheckoutProductListProps,
    any
> {
    constructor(props) {
        super(props);
    }

    render() {
        const { productList } = this.props;

        if (!productList || productList.length <= 0) return;

        return (
            <ScrollView className='checkout-product-list'>
                {productList.map((product) => {
                    return (
                        <View className='product-item' key={product.id}>
                            <View className='row'>
                                <View className='col'>
                                    <Text className='product-name'>
                                        {product.name}
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
                                            x{product.amount}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        );
    }
}
