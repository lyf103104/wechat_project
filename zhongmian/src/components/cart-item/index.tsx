import Taro, { Component } from '@tarojs/taro';
import { AtSwipeAction } from 'taro-ui';
import { View, Text } from '@tarojs/components';
import { BaseEventFunction } from '@tarojs/components/types/common';
import { debounce } from 'lodash';
import { ICartComponentItem } from '../../interfaces';
import { CartService } from '../../services';
import './index.scss';

interface CartItemProps {
    item: ICartComponentItem;
    isClose: boolean | undefined;
    className: string;
    onRefreshCart: () => void;
    onHandleSingle: BaseEventFunction;
}

interface CartItemState {
    /**
     * 购物项购买数量
     */
    amount: number;
}

export default class CartItem extends Component<CartItemProps, CartItemState> {
    static options = { addGlobalClass: true };

    itemSwipeOptions = [
        {
            text: '删除',
            style: { backgroundColor: '#c67a47' },
            action: () => {
                this.deleteProduct();
            }
        }
    ];

    constructor(props) {
        super(props);

        const { item } = this.props;

        this.state = { amount: item ? item.amount : 1 };
    }

    componentWillReceiveProps(nextProps) {
        const { item } = nextProps;
        this.setState({
            amount: item.amount
        });
    }

    /**
     * 商品数量减少
     */
    minusAmount = () => {
        let { amount } = this.state;
        amount--;
        if (amount === 0) {
            return;
        } else {
            this.setState({ amount });
            this.changeCartItemQuantity(amount);
        }
    };

    /**
     * 商品数量增加
     */
    addAmount = () => {
        const { item } = this.props;
        let { amount } = this.state;
        amount++;

        if (amount <= item.sellCount) {
            this.setState({ amount });
            this.changeCartItemQuantity(amount);
        } else {
            Taro.showToast({
                title: '库存不足',
                icon: 'none'
            });
        }
    };

    /**
     * 修改商品数量
     * @param quantity
     */
    changeCartItemQuantity = debounce((quantity) => {
        const { item } = this.props;

        CartService.changeCartItemQuantity({
            itemId: item.itemId,
            goodsId: item.goodsId,
            quantity: quantity
        }).then((result) => {
            if (result.statusCode !== 200) {
                Taro.showToast({
                    title: result.data.message,
                    icon: 'none'
                });
                this.setState({
                    amount: item.amount
                });
                return;
            }
            this.props.onRefreshCart && this.props.onRefreshCart();
        });
    }, 300);

    /**
     * 删除购物项
     * @param cartProduct
     */
    deleteProduct = () => {
        const { item } = this.props;
        CartService.deleteCartItem({
            itemId: item.itemId
        }).then(() => {
            this.props.onRefreshCart && this.props.onRefreshCart();
        });
    };

    handleMenuClick = (unless, index) => {
        const option = this.itemSwipeOptions[index];
        if (option) {
            option.action && option.action();
        }
    };

    render() {
        const { amount } = this.state;
        const { className, onHandleSingle, item } = this.props;

        let options = this.itemSwipeOptions;

        let autoClose = true;

        return (
            <AtSwipeAction
                onClick={this.handleMenuClick}
                autoClose={autoClose}
                options={options}
                isClose={item.isClose}
                onOpened={onHandleSingle}
            >
                <View className={className}>
                    <Text className='item-name'>{item.name}</Text>
                    <View className='item-detail'>
                        <Text className='item-price'>¥{item.price}</Text>
                        <View className='amount-wrap'>
                            <View className='amount-box'>
                                <View
                                    className='icon-box'
                                    onClick={this.minusAmount}
                                >
                                    <View className='amount-icon cm-icon icon-minus' />
                                </View>

                                <Text className='amount-value'>{amount}</Text>
                                <View
                                    className='icon-box'
                                    onClick={this.addAmount}
                                >
                                    <View className='amount-icon cm-icon icon-add' />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </AtSwipeAction>
        );
    }
}
