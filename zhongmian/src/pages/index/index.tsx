import Taro, { Component } from '@tarojs/taro';
import { AtActivityIndicator } from 'taro-ui';
import { View } from '@tarojs/components';
import { isNumber } from 'lodash';
import {
    Router,
    UserService,
    StoreService,
    StoreUrlAnalyzer
} from '../../services';
import { Environment, Birdge } from '../../tools';

interface IndexState {
    /**
     * 提示语
     */
    motd: string;
}

export default class Index extends Component<{}, IndexState> {
    constructor(props) {
        super(props);
        this.state = { motd: '加载中...' };
    }

    componentWillMount() {
        // 等待数据同步
        if (Environment.isWeb) {
            Taro.eventCenter.once('sync.session.complete', () => {
                UserService.isLogin().then(
                    () => {
                        Router.redirect('store');
                    },
                    () => {
                        Taro.showToast({
                            title: '用户登录信息失效'
                        });
                    }
                );
            });
            return;
        }
        // 扫描二维码进入小程序
        if (this.$router.params.q) {
            this.setState({ motd: '进入门店中,请稍候...' });

            const storeId = StoreUrlAnalyzer(
                decodeURIComponent(this.$router.params.q)
            );

            if (!isNumber(storeId)) {
                Taro.showToast({
                    title: '不是合法的门店码',
                    icon: 'none'
                });
                this.selectTarget();
            } else {
                let self = this;
                StoreService.switchStore(storeId).then(function() {
                    self.selectTarget();
                });
            }
        } else {
            this.selectTarget();
        }
    }

    selectTarget = async () => {
        let islogin = await UserService.isLogin();
        if (!islogin) {
            Router.redirect('login');
        } else if (!StoreService.isInStore()) {
            Router.redirect('store');
        } else {
            Router.redirect('cart');
        }
    };

    render() {
        return (
            <View className='index'>
                <AtActivityIndicator mode='center' content={this.state.motd} />
            </View>
        );
    }
}
