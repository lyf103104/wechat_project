import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { isEmpty, merge } from 'lodash';
import {
    CmButton,
    CheckoutConsigner,
    CheckoutJourney,
    CheckoutProducts,
    CheckoutAmount,
    CheckoutCoupon,
    CheckoutGroupCode
} from '../../components';
import { CheckoutService, Router, PaymentService } from '../../services';
import { EventCenter } from '../../constants';
import { SystemInfo, Environment, Birdge, Logger } from '../../tools';
import classnames from 'classnames';
import {
    IChekcout,
    ICheckoutConsigner,
    IPayway,
    ICheckoutDiscount
} from '../../interfaces';
import './index.scss';
import _ from 'lodash';
import { AtActivityIndicator } from 'taro-ui';

interface ICheckOutState {
    data: IChekcout;
    flightNo: string;
    consigner: ICheckoutConsigner;
    memberDiscounts: Array<ICheckoutDiscount>;
    selectMemberDiscount: ICheckoutDiscount;
    selectPaymentMethod: IPayway;
    needInvoice: boolean;
    deliveryModeIdStr: string;
    canSubmit: boolean;
    platform: string;
    model: string;
    groupCode: string | null;
    chooseCardIds: string;
    isLoaded: boolean;
}

let logger = new Logger('checkout');

export default class Index extends Component<{}, ICheckOutState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = { navigationBarTitleText: '结算中心' };

    constructor(props) {
        super(props);

        // this.state = {
        //     data: null,
        //     flightNo: null,
        //     consigner: null,
        //     // memberDiscounts: null, //优惠信息列表
        //     selectMemberDiscount: null, //选中的优惠信息
        //     selectPaymentMethod: null, //选中的支付方式
        //     needInvoice: false, // 是否开发票 0否 1是
        //     deliveryModeIdStr: '1002',
        //     canSubmit: false
        // };
    }

    componentDidMount() {
        this.init();
        this.addEventCenter();
    }

    addEventCenter = () => {
        Taro.eventCenter.on(
            EventCenter.checkoutConsignerUpdate,
            (consigner) => {
                this.setState({ consigner }, this.update);
            }
        );
        Taro.eventCenter.on(EventCenter.checkoutFlightNoUpdate, (flightNo) => {
            this.setState({ flightNo }, this.update);
        });
        Taro.eventCenter.on(
            EventCenter.checkoutCouponUpdate,
            (chooseCardIds) => {
                this.setState(
                    {
                        chooseCardIds
                    },
                    this.update
                );
            }
        );
        Taro.eventCenter.on(EventCenter.checkoutGroupCodeUpdate, (code) => {
            let { groupCode } = this.state;
            if (groupCode != code) {
                this.setState(
                    { groupCode: code, chooseCardIds: '' },
                    this.groupCodeUpdate
                );
            }
        });
    };

    init = async () => {
        const platform = SystemInfo.getPlatform();
        const model = SystemInfo.getModel();
        this.setState({
            platform,
            model,
            needInvoice: false, // 是否开发票 0否 1是
            deliveryModeIdStr: '1002',
            canSubmit: false
        });

        let self = this;

        try {
            const checkoutDiscounts = await CheckoutService.getCheckoutDiscounts();
            self.setState({
                memberDiscounts: checkoutDiscounts.data,
                selectMemberDiscount: checkoutDiscounts.data[0]
            });
            const checkoutInfo = await CheckoutService.getCheckoutInfo();
            self.setState({
                data: checkoutInfo.data,
                consigner: checkoutInfo.data.adress_default,
                selectPaymentMethod: checkoutInfo.data.paywayInfoList[0]
            });
            self.setState({
                isLoaded: true
            });
        } catch (error) {
            Taro.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    update = async () => {
        const {
            consigner,
            flightNo,
            selectMemberDiscount,
            groupCode,
            data
        } = this.state;

        if (consigner && consigner.id > 0 && !isEmpty(flightNo)) {
            this.setState({ canSubmit: true });
        } else {
            this.setState({ canSubmit: false });
        }

        if (consigner && consigner.id > 0 && flightNo && selectMemberDiscount) {
            try {
                let result = await CheckoutService.updateCheckoutInfo({
                    consigneeId: consigner.id,
                    flightNo,
                    discountType: selectMemberDiscount.id,
                    groupGuestCode: groupCode
                });

                this.setState({
                    data: merge({}, data, result.data)
                });
            } catch (error) {
                Taro.showToast({
                    title: '网络繁忙，请稍后重试',
                    icon: 'none'
                });
            }
        }
    };

    groupCodeUpdate = async () => {
        let self = this;

        let { groupCode } = this.state;

        try {
            let result = await CheckoutService.getCheckoutDiscounts(groupCode);

            if (result.statusCode === 200 && result.data) {
                if (result.data.length > 1) {
                    self.setState(
                        {
                            memberDiscounts: result.data,
                            selectMemberDiscount: result.data[1]
                        },
                        self.update
                    );
                } else {
                    self.setState(
                        {
                            memberDiscounts: result.data,
                            selectMemberDiscount: result.data[0]
                        },
                        self.update
                    );
                }
            }
        } catch (error) {
            Taro.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    comfirmOrder = async () => {
        Taro.showLoading({
            title: '订单创建中...',
            mask: true
        });
        const {
            data,
            consigner,
            flightNo,
            selectPaymentMethod,
            selectMemberDiscount,
            needInvoice,
            deliveryModeIdStr,
            chooseCardIds,
            groupCode
        } = this.state;

        if (!consigner) {
            Taro.showToast({
                title: '请添加提货人',
                icon: 'none'
            });
            return;
        }

        if (isEmpty(flightNo)) {
            Taro.showToast({
                title: '请添加航班信息',
                icon: 'none'
            });
            return;
        }

        let createOrder = {
            consigneeId: consigner.id,
            flightNo: flightNo,
            payableAmount: data.amount.payableAmount,
            cartToken: data.cartToken,
            couponIds: chooseCardIds,
            paymentModeType: selectPaymentMethod.type,
            paymentMethod: parseInt(selectPaymentMethod.id),
            discountTypeId: selectMemberDiscount.id,
            groupGuestCode: groupCode,
            needInvoice: needInvoice ? 1 : 0,
            deliveryModeIdStr: deliveryModeIdStr
        };
        try {
            const result = await CheckoutService.createOrder(createOrder);

            if (result.statusCode !== 201) throw result.data.message;

            Taro.eventCenter.trigger(EventCenter.orderSubmit);
            const paymentInfo = await CheckoutService.getPaymentInfo(
                result.data.orderId
            );

            if (Environment.isWeb) {
                const { orderId, orderNumber, payableAmount } = result.data;
                Birdge.Emmit('sync.order', {
                    orderId,
                    orderNumber,
                    payableAmount
                });
                logger.log(`请求APP支付订单: ${orderId}`, {
                    orderId,
                    orderNumber,
                    payableAmount
                });
                setTimeout(() => {
                    Taro.hideLoading();
                    Router.redirect('cart');
                }, 2 * 1000);
                return;
            }

            if (_.isUndefined(paymentInfo.data)) throw result.data.message;

            PaymentService.requestPayment(paymentInfo.data).then(
                function() {
                    Taro.eventCenter.trigger(EventCenter.paySuccess);
                    Router.redirect('payment-success', {
                        payInfo: result.data
                    });
                },
                function() {
                    Router.redirect('orders');
                }
            );
        } catch (error) {
            Taro.showToast({
                title: error ? error : '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    render() {
        const {
            data,
            consigner,
            flightNo,
            selectPaymentMethod,
            canSubmit,
            platform,
            model,
            chooseCardIds,
            groupCode,
            isLoaded
        } = this.state;

        let className: string = classnames(
            'checkout',
            [`platform-${platform}`],
            [`platform-${model}`]
        );

        let selectedInfo = false;
        let consigneeId: number = isEmpty(consigner) ? 0 : consigner.id;
        if (!isEmpty(consigner) && !isEmpty(flightNo)) {
            selectedInfo = true;
        }

        return (
            <View className={className}>
                {isLoaded ? (
                    <View>
                        <CheckoutConsigner consigner={consigner} />
                        <CheckoutJourney flightNo={flightNo} />
                        <View className='hr-fusion' />
                        <View className='payment-box'>
                            <View>支付方式</View>
                            <View className='payment'>
                                {selectPaymentMethod.descript}
                            </View>
                        </View>
                        <View className='hr-fusion' />
                        <CheckoutProducts
                            productList={data.productList}
                            amount={data.amount}
                        />
                        <View className='hr-fusion' />
                        <CheckoutGroupCode
                            groupCode={groupCode}
                            selectedInfo={selectedInfo}
                        />
                        <View className='hr-fusion' />
                        <CheckoutCoupon
                            selectedInfo={selectedInfo}
                            chooseCardIds={chooseCardIds}
                            consigneeId={consigneeId}
                            totalUseAbleCard={data.totalUseAbleCard}
                        />
                        <View className='hr-fusion' />
                        <View className='checkout-amount'>
                            <CheckoutAmount amount={data.amount} />
                        </View>
                        <View className='confirm-bar bar'>
                            <Text>预付金额:</Text>
                            <Text className='payable-amount'>
                                ￥{data.amount.payableAmount}
                            </Text>
                            <CmButton
                                className='confirm-button'
                                type='sharp'
                                onClick={this.comfirmOrder}
                                disabled={!canSubmit}
                            >
                                提交订单
                            </CmButton>
                        </View>
                    </View>
                ) : (
                    <AtActivityIndicator mode='center' content={'加载中...'} />
                )}
            </View>
        );
    }
}
