import Taro, { Component } from '@tarojs/taro';
import { Coupon } from '../../components';
import { ICoupon } from '../../interfaces';
import { ScrollView } from '@tarojs/components';

interface CouponListProps {
    coupons: Array<ICoupon>;
    chooseCardIds: string;
    onClick: (coupon: ICoupon) => any;
}

export default class CouponList extends Component<CouponListProps, any> {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(coupon: ICoupon) {
        this.props.onClick && this.props.onClick(coupon);
    }

    render() {
        const { coupons, chooseCardIds } = this.props;
        if (!coupons || coupons.length <= 0) return;
        const list = coupons.map((coupon) => {
            return (
                <Coupon
                    key={coupon.couponcard_id}
                    coupon={coupon}
                    chooseCardIds={chooseCardIds}
                    onClick={this.onSelect}
                />
            );
        });
        return <ScrollView className='coupon-list'>{list}</ScrollView>;
    }
}
