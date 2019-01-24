import Taro, { Component } from '@tarojs/taro';
import { ScrollView } from '@tarojs/components';
import { forEach } from 'lodash';
import CartItem from '../cart-item';
import { ICartComponentItem } from '../../interfaces';

interface CartProps {
    items: Array<ICartComponentItem>;
    onRefreshCart: () => void;
    onHandleSingleCallBack: (items: Array<ICartComponentItem>) => void;
}

export default class CartComponent extends Component<CartProps, any> {
    constructor(props) {
        super(props);
    }

    handleSingle(goodsId: number) {
        const { items, onHandleSingleCallBack } = this.props;
        forEach(items, function(item) {
            if (goodsId != item.goodsId) {
                item.isClose = true;
            } else {
                item.isClose = false;
            }
        });
        onHandleSingleCallBack(items);
    }

    render() {
        const { items, onRefreshCart } = this.props;

        if (!items || items.length <= 0) return;

        const list = items.map((item, index) => {
            let className =
                index === items.length - 1
                    ? 'product-item product-last-item'
                    : 'product-item';

            return (
                <CartItem
                    key={item.goodsId}
                    item={item}
                    onRefreshCart={onRefreshCart}
                    onHandleSingle={this.handleSingle.bind(this, item.goodsId)}
                    isClose={item.isClose}
                    className={className}
                />
            );
        });
        return <ScrollView className='product-list'>{list}</ScrollView>;
    }
}
