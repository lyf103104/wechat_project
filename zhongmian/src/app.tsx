import Taro, { Component, Config } from '@tarojs/taro';
import '@tarojs/async-await';
import Index from './pages/index';
import './app.scss';
import './resources/iconfont.scss';
import './resources/image-icons.scss';
import { Unique, UserService, ApiService } from './services';
import { Environment, Birdge } from './tools';

class App extends Component {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */

    config: Config = {
        pages: [
            'pages/index/index',
            'pages/login/index',
            'pages/store/index',
            'pages/cart/index',
            'pages/checkout/index',
            'pages/consigner-list/index',
            'pages/edit-consigner-info/index',
            'pages/edit-journey-info/index',
            'pages/checkout-product-list/index',
            'pages/checkout-group-code/index',
            'pages/process/index',
            'pages/coupons/index',
            'pages/payment-success/index',
            'pages/orders/index',
            'pages/order/index',
            'pages/article/index'
        ],
        window: {
            backgroundTextStyle: 'dark',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'cdf自助购',
            navigationBarTextStyle: 'black'
        }
    };

    componentWillMount() {
        // flex polyfill
        if (process.env.TARO_ENV === 'weapp') {
            require('taro-ui/dist/weapp/css/index.css');
        }
        if (process.env.TARO_ENV === 'h5') {
            require('taro-ui/dist/h5/css/index.css');
        }
    }

    componentDidMount() {
        /**
         * 先初始化 Unique
         * 再初始化 api，api 依赖 unique
         * 最后初始化 user，user.init 依赖 api
         */
        Unique.init();
        const unique = Unique.get();

        ApiService.setService(GLOBAL_CONFIG.Server);
        ApiService.customHeader({
            'Accept-Language': 'zh-CN',
            channel: 'weapp',
            apiVersion: '2.0',
            unique
        });

        UserService.init();

        if (Environment.isWeb) {
            Birdge.init(() => {
                // 等待商城同步数据
                Birdge.On('sync.session', (session) => {
                    const {
                        id,
                        loginName,
                        userSession,
                        nickname
                    } = session.user;
                    UserService.syncUserWithAPP({
                        id,
                        loginName,
                        userSession,
                        nickname
                    });

                    const { unique, warehouseId } = session.config;
                    const { subsites } = session.config;
                    ApiService.customHeader({
                        unique,
                        warehouseId,
                        subsiteId: subsites.id
                    });

                    // 避免闪烁
                    setTimeout(() => {
                        Taro.eventCenter.trigger('sync.session.complete');
                    }, 1 * 1000);
                });

                // 处理返回键
                Birdge.On('history.back', () => {
                    window.history.back();
                });
            });
        }
    }

    render() {
        return <Index />;
    }
}

Taro.render(<App />, document.getElementById('app'));
