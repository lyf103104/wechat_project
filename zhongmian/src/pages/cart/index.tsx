import Taro, { Component, Config } from '@tarojs/taro';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { View, Text, Button } from '@tarojs/components';
import {
    ScanService,
    StoreService,
    Router,
    UserService,
    CartService
} from '../../services';
import { CartComponent, CartEmpty, CmButton } from '../../components';
import { EventCenter } from '../../constants';
import { SystemInfo } from '../../tools';
import classnames from 'classnames';
import { ICart, IStore, ICartComponentItem } from '../../interfaces';
import './index.scss';

interface CartState {
    /**
     * 购物车是否加载完毕
     */
    isInit: boolean;
    /**
     * 购物车数据
     */
    data: ICart;
    /**
     * 当前门店信息
     */
    store: IStore;
    /**
     * 是否打开切换门店弹层
     */
    openModal: boolean;
    /**
     * 切换门店码
     */
    storeCode: number;
    /**
     * 用户是否绑定手机
     */
    isBindMobile: boolean;
    platform: string;
    model: string;
}

export default class Index extends Component<{}, CartState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = { navigationBarTitleText: '购物车' };

    constructor(props) {
        super(props);

        Taro.eventCenter.on(EventCenter.orderSubmit, () => {
            this.refreshCart();
        });
        Taro.eventCenter.on(EventCenter.paySuccess, () => {
            this.refreshCart();
        });
    }

    componentWillMount() {
        const platform = SystemInfo.getPlatform();
        const model = SystemInfo.getModel();
        this.setState({
            platform,
            model,
            isInit: false,
            openModal: false,
            isBindMobile: UserService.isBindMobile()
        });
    }

    componentDidMount() {
        const store = StoreService.getCurrentStore();
        if (!store) {
            Router.redirect('store');
        }
        this.setState({ store });
        this.initCart();
    }

    toArticle = () => {
        Router.navigate('article', { code: 'freePolicy' });
    };

    initCart = async () => {
        let result = await CartService.getMineFreesShoppingCart();
        if (result.statusCode === 200) {
            this.setState({ data: result.data, isInit: true });
        } else {
            this.setState({ isInit: true });
        }
    };

    refreshCart = async () => {
        let result = await CartService.getMineFreesShoppingCart();
        if (result.statusCode === 200) {
            this.setState({ data: result.data });
        }
    };

    handleSingleCallBack = (items: Array<ICartComponentItem>) => {
        const { data } = this.state;
        data.cartNormalProduct = items;
        this.setState({ data: data });
    };

    onGetPhoneNumber = async (data) => {
        // 用unionId 和后台换取登录状态
        // 绑定手机号的步骤后置到结算时
        const { errMsg, encryptedData, iv } = data.detail;
        if (errMsg != 'getPhoneNumber:ok') {
            Taro.showToast({
                title: "请点击'允许'完成绑定手机",
                icon: 'none'
            });
            return;
        }
        Taro.showLoading({
            title: '绑定中...',
            mask: true
        });
        const result = await UserService.loginByUnionIdAndPhone({
            encryptedData,
            iv
        });
        Taro.hideLoading();
        if (result) {
            this.setState({ isBindMobile: UserService.isBindMobile() });
            this.confirmOrder();
        } else {
            Taro.showToast({
                title: '绑定失败',
                icon: 'none'
            });
        }
    };

    confirmOrder = () => {
        Router.navigate('checkout');
    };

    handleCancel = () => {
        this.setState({
            openModal: false
        });
    };

    handleConfirm = async () => {
        const { storeCode } = this.state;
        Taro.showLoading({
            title: '切换中...',
            mask: true
        });
        if (await StoreService.switchStore(storeCode)) {
            this.handleCancel();
            Taro.hideLoading();
            this.setState({
                store: StoreService.getCurrentStore()
            });
            this.refreshCart();
        }
    };

    scan = async () => {
        try {
            const code = await ScanService.scanAll();

            if (!code.isStoreId()) {
                CartService.addToCart({
                    barCode: code.getProductBarCode(),
                    amount: 1
                }).then(
                    () => {
                        this.refreshCart();
                    },
                    () => {
                        Taro.showToast({
                            title: '添加商品失败',
                            icon: 'none'
                        });
                    }
                );
            } else {
                const currentStore = StoreService.getCurrentStore();
                const switchStore = await StoreService.getStoreById(
                    code.getStoreId()
                );

                if (
                    switchStore.data &&
                    switchStore.data.id === currentStore.id
                ) {
                    Taro.showToast({
                        title:
                            '您当前已经在' +
                            currentStore.warehouseName +
                            '店，请直接购物',
                        icon: 'none'
                    });
                } else {
                    this.setState({
                        openModal: true,
                        storeCode: code.getStoreId()
                    });
                }
            }
        } catch (error) {
            Taro.hideLoading();
            Taro.showToast({
                title: '扫码失败',
                icon: 'none'
            });
        }
    };

    render() {
        const {
            data,
            openModal,
            store,
            isBindMobile,
            isInit,
            platform,
            model
        } = this.state;
        let className: string = classnames(
            'cart',
            [`platform-${platform}`],
            [`platform-${model}`]
        );
        return (
            <View className={className}>
                {data && data.reminder ? (
                    <View className='cart-tip' onClick={this.toArticle}>
                        <Text>{data.reminder.join(',')}</Text>
                        <Text className='tip-link'>{'详情>'}</Text>
                    </View>
                ) : (
                    ''
                )}

                {isInit && !data.cartNormalProduct ? (
                    <CartEmpty onScan={this.scan} store={store} />
                ) : (
                    ''
                )}
                {data &&
                data.cartNormalProduct &&
                data.cartNormalProduct.length > 0 ? (
                    <View className='cart-content'>
                        <CartComponent
                            items={data.cartNormalProduct}
                            onRefreshCart={this.refreshCart}
                            onHandleSingleCallBack={this.handleSingleCallBack}
                        />
                        <View className='cart-footer'>
                            <View className='limit-tips'>
                                <Text className='cm-icon icon-circle' />
                                <Text className='limit-text'>
                                    自助购物最多可以买 10 种商品哦！
                                </Text>
                            </View>
                            <View className='cart-footer-info'>
                                <View className='cart-scan' onClick={this.scan}>
                                    <View className='cm-icon icon-scan' />
                                    <Text className='cart-scan-text'>
                                        扫一扫
                                    </Text>
                                </View>
                                <View className='cart-total-info'>
                                    <View>
                                        <View className='payable-amount-label'>
                                            <Text className='payable-amount-text'>
                                                合计:
                                            </Text>
                                            <Text className='payable-amount-value'>
                                                ￥{data.amount.payableAmount}
                                            </Text>
                                        </View>
                                        <View className='payable-calculate-label'>
                                            <Text className='payable-calculate-text'>
                                                总价:￥
                                                {
                                                    data.amount
                                                        .productTotalAmount
                                                }{' '}
                                                优惠:￥
                                                {data.amount.discountAmount}
                                            </Text>
                                        </View>
                                    </View>
                                    {isBindMobile ? (
                                        <CmButton
                                            type='sharp'
                                            className='checkout-button'
                                            onClick={this.confirmOrder}
                                        >
                                            结算
                                            <Text className='item-count'>
                                                ({data.amount.productQuantity})
                                            </Text>
                                        </CmButton>
                                    ) : (
                                        <CmButton
                                            type='sharp'
                                            className='checkout-button'
                                            openType='getPhoneNumber'
                                            onGetPhoneNumber={
                                                this.onGetPhoneNumber
                                            }
                                        >
                                            结算
                                            <Text className='item-count'>
                                                ({data.amount.productQuantity})
                                            </Text>
                                        </CmButton>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    ''
                )}

                {data &&
                data.cartNormalProduct &&
                data.cartNormalProduct.length === 0 ? (
                    <CartEmpty onScan={this.scan} store={store} />
                ) : (
                    ''
                )}

                <AtModal isOpened={openModal}>
                    <AtModalContent>
                        <View className='modal-content'>
                            您确认切换门店吗？
                        </View>
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={this.handleCancel}>取消</Button>
                        <Button onClick={this.handleConfirm}>确定</Button>
                    </AtModalAction>
                </AtModal>
            </View>
        );
    }
}
