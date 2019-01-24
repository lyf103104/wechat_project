import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { isEmpty } from 'lodash';
import './index.scss';
import { Router } from '../../../services';

interface CheckoutCouponProps {
    consigneeId: number;
    chooseCardIds: string;
    totalUseAbleCard: number;
    selectedInfo: boolean;
}
export default class CheckoutCoupon extends Component<CheckoutCouponProps> {
    static options = { addGlobalClass: true };
    constructor(props) {
        super(props);
    }

    toCouponsPage = () => {
        const {
            totalUseAbleCard,
            selectedInfo,
            consigneeId,
            chooseCardIds
        } = this.props;
        if (!selectedInfo || totalUseAbleCard === 0) return;
        Router.navigate('coupons', { chooseCardIds, consigneeId });
    };

    render() {
        const { totalUseAbleCard, chooseCardIds } = this.props;
        return (
            <View className='checkout-coupon' onClick={this.toCouponsPage}>
                <View className='coupon-title'>代金券</View>
                <View className='coupon-detail'>
                    {!isEmpty(chooseCardIds) ? (
                        <Text className='coupon-detail-text'>
                            已选择 1 张优惠券
                        </Text>
                    ) : (
                        <Text className='coupon-detail-text'>
                            {totalUseAbleCard || totalUseAbleCard === 0
                                ? totalUseAbleCard + '张可用'
                                : '张可用'}
                        </Text>
                    )}
                    <View className='cm-icon icon-arrow-right-outline-black coupon-arrow' />
                </View>
            </View>
        );
    }
}
