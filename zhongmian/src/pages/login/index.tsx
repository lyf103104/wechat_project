import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { CmButton } from '../../components';
import { UserService, StoreService, Router } from '../../services';
import './index.scss';

export default class Index extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = { navigationBarTitleText: '授权登录' };

    constructor(props) {
        super(props);
    }

    onGetUserInfo = async () => {
        // 用unionId 和后台换取登录状态
        // 绑定手机号的步骤后置到结算时
        const { code } = await Taro.login();
        const data = await Taro.getUserInfo();

        const { encryptedData, iv, signature } = data;

        if (!encryptedData || !iv || !signature) {
            Taro.showToast({
                title: "请点击'允许'完成登录",
                icon: 'none'
            });
            return;
        } else {
            Taro.showLoading({
                title: '登录中...',
                mask: true
            });
            const result = await UserService.loginByUnionId({
                code,
                encryptedData,
                iv,
                signature
            });
            Taro.hideLoading();
            if (result) {
                if (!StoreService.isInStore()) {
                    Router.redirect('store');
                } else {
                    Router.redirect('cart');
                }
            }
        }
    };

    render() {
        let circle = true;

        return (
            <View className='login'>
                <View className='login-panel'>
                    <View className='logo' />
                    <CmButton
                        className='login-button'
                        circle={circle}
                        openType='getUserInfo'
                        onGetUserInfo={this.onGetUserInfo}
                    >
                        微信用户一键登录
                    </CmButton>
                </View>
            </View>
        );
    }
}
