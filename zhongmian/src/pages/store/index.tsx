import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { ScanService, StoreService, Router, UserService } from '../../services';
import { CmButton } from '../../components';
import './index.scss';

interface StoreState {
    /**
     * 用户是否绑定手机
     */
    isBindMobile: boolean;
}

export default class Index extends Component<{}, StoreState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = { navigationBarTitleText: '扫描门店' };
    constructor(props) {
        super(props);
        this.state = {
            isBindMobile: UserService.isBindMobile()
        };
    }

    scanStore = async () => {
        try {
            const storeId = await ScanService.store();
            Taro.showLoading({
                title: '扫描中...',
                mask: true
            });
            let result = await StoreService.switchStore(storeId);
            Taro.hideLoading();
            if (result) {
                if (!(await UserService.isLogin())) {
                    Router.redirect('login');
                    return;
                }
                Router.redirect('cart');
            } else {
                Taro.showToast({
                    title: '门店信息异常',
                    icon: 'none'
                });
            }
        } catch (error) {
            Taro.hideLoading();
            Taro.showToast({
                title: '不是合法的门店码',
                icon: 'none'
            });
        }
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
        const { isBindMobile } = this.state;
        return (
            <View className='store'>
                <View className='banner' />
                <View className='middle-panel'>
                    <View className='main-tips'>
                        <Text>请先扫描“门店码”</Text>
                    </View>
                    <View className='sub-tips'>
                        <Text className='cm-icon icon-circle' />
                        <Text className='sub-tips-text'>
                            您身旁的货架上方贴有“门店码”，如需帮助请咨询门店服务人员
                        </Text>
                    </View>

                    <CmButton type='sharp' onClick={this.scanStore}>
                        扫一扫
                    </CmButton>
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
