import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { isEmpty } from 'lodash';
import { CouponList, CmButton } from '../../components';
import { Router, CheckoutService } from '../../services';
import { EventCenter } from '../../constants';
import { ICoupon } from 'src/interfaces';
import './index.scss';

interface CouponPageParams {
    chooseCardIds: string;
    consigneeId: number;
}

interface CouponsState {
    coupons: Array<ICoupon>;
    chooseCardIds: string;
    consigneeId: number;
}

export default class Index extends Component<any, CouponsState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '可用代金券'
    };
    constructor(props) {
        super(props);

        let params = Router.getParams<CouponPageParams>(this);

        let chooseCardIds: string =
            params && params.chooseCardIds ? params.chooseCardIds : '';
        let consigneeId: number =
            params && params.consigneeId ? params.consigneeId : 0;

        this.state = {
            coupons: [],
            chooseCardIds,
            consigneeId
        };
    }

    componentDidMount() {
        this.loadCoupons();
    }

    loadCoupons = () => {
        CheckoutService.getCouponList().then((result) => {
            if (result.statusCode === 200) {
                const coupons = result.data.couponCard;
                this.setState({
                    coupons
                });
            }
        });
    };

    onCouponClick = async (coupon: ICoupon) => {
        const chooseCardIds = coupon.couponcard_id;

        this.useCoupon(chooseCardIds);
    };

    cancelUseCoupon = () => {
        let chooseCardIds = '';
        this.setState({
            chooseCardIds
        });
        this.useCoupon(chooseCardIds);
    };

    useCoupon = async (chooseCardIds) => {
        const consigneeId: number = this.state.consigneeId;
        let params = {
            consigneeId,
            couponIds: [parseInt(chooseCardIds)]
        };

        await CheckoutService.useCoupon(params).then((result) => {
            if (result.statusCode === 200) {
                const coupons = result.data.couponCard;
                const chooseCardIds = result.data.chooseCardIds;
                this.setState({
                    coupons,
                    chooseCardIds
                });

                Taro.eventCenter.trigger(
                    EventCenter.checkoutCouponUpdate,
                    chooseCardIds
                );
            }
        });

        Router.back();
    };

    render() {
        const { coupons, chooseCardIds } = this.state;
        return (
            <View className='coupon'>
                <CouponList
                    coupons={coupons}
                    chooseCardIds={chooseCardIds}
                    onClick={this.onCouponClick}
                />
                <View className='cancel-button'>
                    <CmButton
                        type='sharp'
                        disabled={isEmpty(chooseCardIds)}
                        onClick={this.cancelUseCoupon}
                    >
                        放弃使用
                    </CmButton>
                </View>
            </View>
        );
    }
}
