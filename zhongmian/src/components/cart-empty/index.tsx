import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { IStore } from 'src/interfaces';
import { Router, UserService } from '../../services';

import { CmButton } from '../../components';
import './index.scss';

interface CartEmptyProps {
    store: IStore;
    onScan: () => void;
}

interface CartEmptyState {
    /**
     * 用户是否绑定手机
     */
    isBindMobile: boolean;
}

export default class CartEmpty extends Component<
    CartEmptyProps,
    CartEmptyState
> {
    constructor(props) {
        super(props);
        this.state = { isBindMobile: UserService.isBindMobile() };
    }

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
            this.state = {
                isBindMobile: UserService.isBindMobile()
            };
            this.toOrdersPage();
        } else {
            Taro.showToast({
                title: '绑定失败',
                icon: 'none'
            });
        }
    };

    toProcess = () => {
        Router.navigate('process');
    };

    toOrdersPage() {
        Router.navigate('orders');
    }

    render() {
        const { onScan, store } = this.props;
        const { isBindMobile } = this.state;

        return (
            <View className='product-empty'>
                <View className='store'>
                    <View className='store-icon' />
                    <Text className='store-text'>您所在的门店：</Text>
                    <Text className='store-name'>{store.warehouseName}</Text>
                </View>
                <View className='icon-box'>
                    <View className='icon scan-icon' />
                    <Text className='line' />
                    <View className='icon pay-icon' />
                    <Text className='line' />
                    <View className='icon leave-icon' />
                </View>
                <View className='text-box title'>
                    <Text className='text'>扫一扫</Text>
                    <Text className='text'>在线支付</Text>
                    <Text className='text text-last'>专属通道</Text>
                </View>
                <View className='text-box sub-title'>
                    <Text className='text'>商品条形码</Text>
                    <Text className='text'>获得二维码</Text>
                    <Text className='text text-last'>凭二维码离店</Text>
                </View>
                <View className='button-box' onClick={onScan}>
                    <View className='code-icon' />
                    <Text className='button-text'>扫一扫</Text>
                </View>
                <View className='limit-tips'>
                    <Text className='cm-icon icon-circle' />
                    <Text className='limit-text'>
                        自助购物最多可以买 10 种商品哦！
                    </Text>
                </View>
                <View className='bottom-buttons'>
                    <View className='bottom-button'>
                        {isBindMobile ? (
                            <CmButton type='text' onClick={this.toOrdersPage}>
                                自助购订单
                            </CmButton>
                        ) : (
                            <CmButton
                                type='text'
                                openType='getPhoneNumber'
                                onGetPhoneNumber={this.onGetPhoneNumber}
                            >
                                自助购订单
                            </CmButton>
                        )}
                    </View>
                    <Text className='separate-line' />
                    <View className='bottom-button'>
                        <CmButton type='text' onClick={this.toProcess}>
                            查看购物流程
                        </CmButton>
                    </View>
                </View>
            </View>
        );
    }
}
