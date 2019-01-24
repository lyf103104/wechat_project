import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { CmButton, CmInput } from '../../components';
import { Router, CheckoutService } from '../../services';
import { EventCenter } from '../../constants';
import { assign, isEmpty } from 'lodash';
import './index.scss';

interface CheckoutGroupCodePageParams {
    code: string | null;
}

interface CheckoutGroupCodePageState {
    code?: string | null;
    groupCodeValid: boolean;
    groupCodeValidInfo: {
        showValidState: boolean;
        error: boolean;
        errorMsg: string;
    };
}

export default class Index extends Component<{}, CheckoutGroupCodePageState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '团客优惠码'
    };

    FormValidDefined = {
        groupCodeValid: {
            emptyMsg: '请输入您的团客优惠码',
            formatExg: /^[0-9]{5,20}$/,
            formatMsg: '请输入正确的团客优惠码'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            groupCodeValid: false,
            groupCodeValidInfo: {
                showValidState: false,
                error: false,
                errorMsg: ''
            }
        };
    }

    componentDidMount() {
        let params = Router.getParams<CheckoutGroupCodePageParams>(this);
        if (params) {
            this.setState({
                code: params.code,
                groupCodeValid: !!params.code
            });
        }
    }

    saveGroupCode = async () => {
        const { code } = this.state;

        try {
            let result = await CheckoutService.confirmGroupCode(code);

            if (result.statusCode === 200) {
                Taro.eventCenter.trigger(
                    EventCenter.checkoutGroupCodeUpdate,
                    code
                );
                Router.back();
            } else {
                Taro.showToast({
                    title:
                        result.data && result.data.message
                            ? result.data.message
                            : '团客码错误',
                    icon: 'none'
                });
            }
        } catch (error) {
            Taro.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    cancelGroupCode = () => {
        Taro.eventCenter.trigger(EventCenter.checkoutGroupCodeUpdate, null);
        Router.back();
    };

    onGroupCodeChange = (code: string) => {
        this.setState({
            code
        });
        this.validGroupCode(code);
    };

    validGroupCode = (groupCode: string) => {
        let error = false;
        let errorMsg = '';
        const groupCodeValid = this.FormValidDefined.groupCodeValid;
        if (isEmpty(groupCode)) {
            error = true;
            errorMsg = groupCodeValid.emptyMsg;
        } else if (!groupCodeValid.formatExg.test(groupCode)) {
            error = true;
            errorMsg = groupCodeValid.formatMsg;
        }

        this.setState({
            groupCodeValidInfo: assign(this.state.groupCodeValidInfo, {
                showValidState: true,
                error,
                errorMsg
            }),
            groupCodeValid: !error
        });
    };

    render() {
        const { code, groupCodeValid, groupCodeValidInfo } = this.state;

        return (
            <View className='group-code-page'>
                <View className='group-code'>
                    <CmInput
                        type='text'
                        title='团客优惠码'
                        placeholder='请输入团客优惠码'
                        value={code ? code : ''}
                        onChange={this.onGroupCodeChange}
                        onBlur={this.validGroupCode}
                        showValidState={groupCodeValidInfo.showValidState}
                        error={groupCodeValidInfo.error}
                        errorMsg={groupCodeValidInfo.errorMsg}
                    />
                </View>
                <View className='group-code-buttons'>
                    <CmButton
                        className='group-code-button save-button'
                        type='sharp'
                        disabled={!groupCodeValid}
                        onClick={this.saveGroupCode}
                    >
                        确认
                    </CmButton>
                    <CmButton
                        className='group-code-button cancel-button'
                        theme='grey'
                        type='sharp'
                        onClick={this.cancelGroupCode}
                    >
                        放弃使用
                    </CmButton>
                </View>
            </View>
        );
    }
}
