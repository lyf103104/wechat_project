import Taro, { Component } from '@tarojs/taro';
import { AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { View, Text, Button, RichText } from '@tarojs/components';
import classnames from 'classnames';
import { Router, ArticleService } from '../../../services';
import { EventCenter } from '../../../constants';
import './index.scss';

interface CheckoutGroupCodeProp {
    selectedInfo: boolean;
    groupCode: string | null;
}

interface CheckoutGroupCodeState {
    groupCode: string | null;
    isOpened: boolean;
    articleContent?: string;
}

export default class CheckoutGroupCode extends Component<
    CheckoutGroupCodeProp,
    CheckoutGroupCodeState
> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);

        const { groupCode } = this.props;

        this.state = { isOpened: false, groupCode };
    }

    componentDidMount() {
        Taro.eventCenter.on(
            EventCenter.checkoutGroupCodeUpdate,
            (groupCode) => {
                this.setState({ groupCode });
            }
        );

        ArticleService.getArticleWithCode('groupGuestDiscountDescription').then(
            (result) => {
                this.setState({ articleContent: result.data.content });
            }
        );
    }

    toGroupCodePage = () => {
        const { groupCode } = this.state;
        const { selectedInfo } = this.props;
        if (!selectedInfo) return;
        Router.navigate('checkout-group-code', {
            code: groupCode
        });
    };

    showGroupCode = () => {
        this.setState({ isOpened: true });
    };

    hideGroupCode = () => {
        this.setState({ isOpened: false });
    };

    render() {
        const { isOpened, articleContent, groupCode } = this.state;

        let detailTextClassName: string = classnames('group-code-detail-text', {
            'default-text': !groupCode
        });

        return (
            <View className='checkout-group-code'>
                <View className='group-code-title' onClick={this.showGroupCode}>
                    <Text className='mr10'>团客优惠码</Text>
                    <Text className='cm-icon cion-query-bold-circle-outline' />
                </View>
                {isOpened && articleContent ? (
                    <AtModal isOpened={isOpened} onClose={this.hideGroupCode}>
                        <AtModalContent>
                            {articleContent ? (
                                <RichText
                                    className='group-code-modal'
                                    nodes={articleContent}
                                />
                            ) : (
                                ''
                            )}
                        </AtModalContent>
                        <AtModalAction>
                            <Button onClick={this.hideGroupCode}>确定</Button>
                        </AtModalAction>
                    </AtModal>
                ) : (
                    ''
                )}
                <View
                    className='group-code-detail'
                    onClick={this.toGroupCodePage}
                >
                    <Text className={detailTextClassName}>
                        {groupCode ? groupCode : '未填写'}
                    </Text>
                    <Text className='cm-icon icon-arrow-right-outline-black group-code-arrow' />
                </View>
            </View>
        );
    }
}
