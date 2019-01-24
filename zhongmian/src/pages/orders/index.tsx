import Taro, { Component, Config } from '@tarojs/taro';
import { AtModal, AtModalContent } from 'taro-ui';
import { View } from '@tarojs/components';
import { EventCenter } from '../../constants';
import { OrderList, QRCode } from '../../components';
import { IOrderList } from '../../interfaces';
import { OrderService } from '../../services';
import './index.scss';

interface OrderListState {
    /**
     * 订单列表
     */
    orders: null | Array<IOrderList>;
    /**
     * 订单状态
     */
    type: number;
    /**
     * 当前页
     */
    page: number;
    /**
     * 每页展示数量
     */
    count: number;
    /**
     * 总页数
     */
    totalPage: number;
    /**
     * 提货二维码
     */
    codeValue: string;
    /**
     * 提货二维码弹框开关
     */
    openCodeModal: boolean;
    /**
     * 加载中
     */
    loading: boolean;
}

export default class Index extends Component<{}, OrderListState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '自助购订单'
    };
    constructor(props) {
        super(props);

        this.state = {
            orders: null,
            type: 0,
            page: 1,
            count: 10,
            totalPage: 1,
            codeValue: '',
            openCodeModal: false,
            loading: false
        };

        Taro.eventCenter.on(EventCenter.orderlistPaySuccess, () => {
            this.init();
        });
    }

    componentDidMount() {
        this.init();
    }

    onReachBottom() {
        // 上拉加载
        this.onNextPage();
    }

    getOrders = async () => {
        const { type, page, count } = this.state;

        let params = {
            type,
            page,
            count
        };

        this.setState({ loading: true });

        Taro.showLoading({
            title: '加载中...',
            mask: true
        });
        try {
            const result = await OrderService.getMineOrders(params);

            if (result.statusCode === 200) {
                Taro.hideLoading();
                const data = result.data;

                let orders = this.state.orders;
                this.setState({
                    orders:
                        orders && page !== 1
                            ? orders.concat(data.orders_list)
                            : data.orders_list,
                    page: data.page,
                    totalPage: Math.ceil(data.total_count / count)
                });
            } else {
                Taro.hideLoading();
                Taro.showToast({
                    title: '网络繁忙，请稍后重试',
                    icon: 'none'
                });
            }
        } catch (error) {
            Taro.hideLoading();
            Taro.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
        this.setState({ loading: false });
    };

    init = () => {
        this.setState(
            {
                page: 1
            },
            this.getOrders
        );
    };

    onRefreshPage = () => {
        this.setState({ page: 1, loading: true }, this.getOrders);
    };

    onNextPage = () => {
        const { loading, page, totalPage } = this.state;
        let nextPage = page + 1;
        if (!loading && nextPage <= totalPage) {
            this.setState({ page: nextPage, loading: true }, this.getOrders);
        }
    };

    onShowOrderCode = (codeValue) => {
        this.setState({
            codeValue,
            openCodeModal: true
        });
    };

    onClose = () => {
        this.setState({ openCodeModal: false });
    };

    render() {
        const { orders, openCodeModal, codeValue } = this.state;

        return (
            <View className='orders'>
                {orders ? (
                    <OrderList
                        orders={orders}
                        onRefreshPage={this.onRefreshPage}
                        onShowOrderCode={this.onShowOrderCode}
                    />
                ) : (
                    ''
                )}
                {openCodeModal ? (
                    <AtModal isOpened={openCodeModal} onClose={this.onClose}>
                        <AtModalContent>
                            {openCodeModal && codeValue ? (
                                <View className='order-code-box'>
                                    <View className='order-code'>
                                        <QRCode
                                            QRid='orderCode'
                                            size={180}
                                            value={codeValue
                                                .toString()
                                                .toLowerCase()}
                                        />
                                    </View>
                                    <View className='order-title'>
                                        订单号：
                                    </View>
                                    <View>{codeValue}</View>
                                </View>
                            ) : (
                                ''
                            )}
                        </AtModalContent>
                    </AtModal>
                ) : (
                    ''
                )}
            </View>
        );
    }
}
