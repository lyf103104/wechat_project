import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { CmButton, CmInput } from '../../components';
import { Router } from '../../services';
import { assign, isEmpty } from 'lodash';
import { EventCenter } from '../../constants';
import './index.scss';

interface EditJourneyInfoPageParams {
    flightNo?: string;
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
        navigationBarTitleText: '填写航班信息'
    };

    FlighNoValidDefined = {
        emptyMsg: '请输入你的航班号',
        formatExg: /^[0-9a-zA-Z]{3,8}$/,
        formatMsg: '请输入正确的航班号'
    };
    constructor(props) {
        super(props);
        let params = Router.getParams<EditJourneyInfoPageParams>(this);

        let flightNo: string = params && params.flightNo ? params.flightNo : '';
        let flightValid: boolean = flightNo !== '' ? true : false;

        this.state = {
            flightNo: flightNo,
            flightValid: flightValid,
            flightNoValidInfo: {
                showValidState: false,
                error: false,
                errorMsg: ''
            }
        };
    }

    flightNoChange = (flightNo: string) => {
        this.setState({
            flightNo
        });
        this.validFlightNo(flightNo);
    };

    flightNoBlur = (flightNo: string) => {
        this.setState({
            flightNoValidInfo: assign(this.state.flightNoValidInfo, {
                showValidState: true
            })
        });

        this.validFlightNo(flightNo);
    };

    validFlightNo = (flightNo: string) => {
        let error = false;
        let errorMsg = '';
        const flightNoValid = this.FlighNoValidDefined;
        if (isEmpty(flightNo)) {
            error = true;
            errorMsg = flightNoValid.emptyMsg;
        } else if (!flightNoValid.formatExg.test(flightNo)) {
            error = true;
            errorMsg = flightNoValid.formatMsg;
        }

        this.setState({
            flightNoValidInfo: assign(this.state.flightNoValidInfo, {
                error,
                errorMsg
            }),
            flightValid: !error
        });
    };

    flightConfirm = async () => {
        const { flightNo } = this.state;

        Taro.eventCenter.trigger(EventCenter.checkoutFlightNoUpdate, flightNo);
        Router.back();
    };

    render() {
        const { flightNo, flightValid, flightNoValidInfo } = this.state;
        return (
            <View className='journey-info'>
                <View className='flight-box'>
                    <CmInput
                        type='text'
                        title='航班号'
                        placeholder='请输入你的航班号'
                        value={flightNo}
                        onChange={this.flightNoChange}
                        onBlur={this.flightNoBlur}
                        showValidState={flightNoValidInfo.showValidState}
                        error={flightNoValidInfo.error}
                        errorMsg={flightNoValidInfo.errorMsg}
                    />
                </View>
                <View className='submit-button'>
                    <CmButton
                        type='sharp'
                        disabled={!flightValid}
                        onClick={this.flightConfirm}
                    >
                        确认
                    </CmButton>
                </View>
            </View>
        );
    }
}
