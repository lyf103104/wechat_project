import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { CheckoutProductList } from '../../components';
import { IProduct, IAmount } from '../../interfaces';
import { Router } from '../../services';
import './index.scss';

interface CheckoutProductListParams {
    productList: Array<IProduct>;
    amount: IAmount;
}

export default class Index extends Component<any, any> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '商品清单'
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let params = Router.getParams<CheckoutProductListParams>(this);

        this.setState({
            productList: params ? params.productList : null,
            amount: params ? params.amount : null
        });
    }

    render() {
        const { productList, amount } = this.state;

        return (
            <View className='checkout-product-list'>
                <CheckoutProductList productList={productList} />
                <View className='checkout-product-total'>
                    <Text>共</Text>
                    <Text className='text'>
                        {amount && amount.productQuantity}
                    </Text>
                    <Text>件商品，预付金额:</Text>
                    <Text className='text'>
                        ￥{amount && amount.payableAmount}
                    </Text>
                </View>
            </View>
        );
    }
}
