import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import * as _ from 'lodash';
import { ICheckoutAmount } from '../../../interfaces';
import './index.scss';

interface CheckoutAmountProps {
    amount: ICheckoutAmount;
}

export default class CheckoutAmount extends Component<CheckoutAmountProps> {
    constructor(props) {
        super(props);
    }

    render() {
        const { amount } = this.props;
        if (!amount) return;
        return (
            <View className='checkout-amount'>
                <View>
                    <Text>商品金额：</Text>
                    <Text className='amount-value'>
                        ￥{amount.productTotalAmount}
                    </Text>
                </View>
                {amount.discountAmount && !_.isEmpty(amount.discountAmount) ? (
                    <View>
                        <Text>折扣金额：</Text>
                        <Text className='amount-value'>
                            ￥{amount.discountAmount}
                        </Text>
                    </View>
                ) : (
                    ''
                )}
                {amount.couponDiscountAmount &&
                !_.isEmpty(amount.couponDiscountAmount) ? (
                    <View>
                        <Text>代金券：</Text>
                        <Text className='amount-value'>
                            ￥{amount.couponDiscountAmount}
                        </Text>
                    </View>
                ) : (
                    ''
                )}
            </View>
        );
    }
}
