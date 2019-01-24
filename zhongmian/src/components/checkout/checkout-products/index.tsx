import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { IProduct, IAmount } from '../../../interfaces';
import { Router } from '../../../services';
import './index.scss';

interface CheckoutProductListProps {
    productList: Array<IProduct>;
    amount: IAmount;
}

export default class CheckoutProducts extends Component<
    CheckoutProductListProps,
    any
> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    goCheckoutProductList = () => {
        const { productList, amount } = this.props;
        Router.navigate('checkout-product-list', { productList, amount });
    };

    render() {
        const { amount } = this.props;

        return (
            <View
                className='checkout-product-list'
                onClick={this.goCheckoutProductList}
            >
                <View className='title'>商品详情</View>
                <View className='product-sum'>
                    <Text>共</Text>
                    <Text className='sum-text'>{amount.productQuantity}</Text>
                    <Text>件商品，预付金额：</Text>
                    <Text className='sum-text'>￥{amount.payableAmount}</Text>
                </View>
                <View className='icon-arrow cm-icon icon-arrow-right-outline-black' />
            </View>
        );
    }
}
