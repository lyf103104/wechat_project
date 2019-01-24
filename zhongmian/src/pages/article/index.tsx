import Taro, { Component, Config } from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { Router, ArticleService } from '../../services';
import './index.scss';

interface ArticleState {
    /**
     * 文章内容
     */
    data: string;
}

export default class Index extends Component<{}, ArticleState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = { navigationBarTitleText: '文章详情' };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.onInit();
    }

    onInit = () => {
        let params = Router.getParams<any>(this);
        if (params.id) {
            ArticleService.getArticle(params.id).then((result) => {
                this.setState({ data: result.data.content });
            });
        } else if (params.code) {
            ArticleService.getArticleWithCode(params.code).then((result) => {
                this.setState({ data: result.data.content });
            });
        }
    };

    render() {
        const { data } = this.state;

        return (
            <View className='article-page rio'>
                {data ? <RichText nodes={data} /> : ''}
            </View>
        );
    }
}
