import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = { navigationBarTitleText: '购物流程' };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View className='journey'>
                <View className='journey-step'>
                    <Text className='step-number'>1</Text>
                    <View className='step-texts'>
                        <View className='text'>咨询店员/扫描门店码</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon one-step' />
                </View>
                <View className='journey-step grey-bg'>
                    <Text className='step-number'>2</Text>
                    <View className='step-texts'>
                        <View className='text'>挑选商品，扫一扫加入购物袋</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon two-step' />
                </View>
                <View className='journey-step'>
                    <Text className='step-number'>3</Text>
                    <View className='step-texts'>
                        <View className='text'>填写购买人信息</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon three-step' />
                </View>
                <View className='journey-step grey-bg'>
                    <Text className='step-number'>4</Text>
                    <View className='step-texts'>
                        <View className='text'>填写行程</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon four-step' />
                </View>
                <View className='journey-step'>
                    <Text className='step-number'>5</Text>
                    <View className='step-texts'>
                        <View className='text'>提交订单</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon five-step' />
                </View>
                <View className='journey-step grey-bg'>
                    <Text className='step-number'>6</Text>
                    <View className='step-texts'>
                        <View className='text'>支付货款</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon six-step' />
                </View>
                <View className='journey-step'>
                    <Text className='step-number'>7</Text>
                    <View className='step-texts'>
                        <View className='text'>专属通道，核验二维码</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon seven-step' />
                </View>
                <View className='journey-step grey-bg'>
                    <Text className='step-number'>8</Text>
                    <View className='step-texts'>
                        <View className='text'>轻松购物，完美无忧</View>
                        <View className='text-quiet'>STEP</View>
                    </View>
                    <View className='step-icon eight-step' />
                </View>
            </View>
        );
    }
}
