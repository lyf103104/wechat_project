import Taro, { Component } from '@tarojs/taro';
import { ICoupon } from '../../interfaces';
import { View, Text, Radio } from '@tarojs/components';
import './index.scss';

interface CouponProps {
    coupon: ICoupon;
    chooseCardIds: string;
    onClick: (coupon: ICoupon) => void;
}

export default class Coupon extends Component<CouponProps, any> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    onClick = () => {
        this.props.onClick && this.props.onClick(this.props.coupon);
    };

    render() {
        let { coupon, chooseCardIds } = this.props;

        return coupon ? (
            <View className='coupon-item' onClick={this.onClick}>
                <View className='coupon-checked'>
                    <Radio
                        color='#c67a47'
                        checked={
                            chooseCardIds === coupon.couponcard_id.toString()
                        }
                        value={coupon.couponcard_id}
                    />
                </View>
                <View className='coupon-content'>
                    <View className='coupon-card'>
                        <View className='coupon-card-left'>
                            ￥
                            <Text className='coupon-price'>{coupon.price}</Text>
                        </View>
                        <View className='coupon-border-box'>
                            <View className='coupon-border' />
                        </View>
                        <View className='coupon-card-right'>
                            <View className='coupon-card-info'>
                                {coupon.couponUseInfo}
                            </View>
                            <View className='coupon-card-time'>
                                {coupon.time_info}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        ) : (
            ''
        );
    }
}
