import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { findIndex, assign, isEmpty, isUndefined } from 'lodash';
import classnames from 'classnames';
import { Country, CredentialsType, EventCenter } from '../../constants';
import { IConsignerListConsigner } from '../../interfaces';
import { CmButton, CmInput } from '../../components';
import { Router, ConsignerService } from '../../services';
import './index.scss';
import { Environment } from '../../tools';

interface AddEditConsignerPageParams {
    consigner?: IConsignerListConsigner;
}

interface AddEditConsignerPageState {
    isLoaded: boolean;
    consigner?: IConsignerListConsigner;
    nameValidInfo: {
        showValidState: boolean;
        error: boolean;
        errorMsg: string;
    };
    cardNoValidInfo: {
        showValidState: boolean;
        error: boolean;
        errorMsg: string;
    };
    phoneValidInfo: {
        showValidState: boolean;
        error: boolean;
        errorMsg: string;
    };
    saveDisabled: boolean;
}

export default class Index extends Component<any, AddEditConsignerPageState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '提货人信息'
    };

    FormValidDefined = {
        nameValid: {
            emptyMsg: '请输入您的姓名',
            formatExg: /^[^0-9]{2,50}$/,
            formatMsg: '请输入正确的姓名'
        },
        cardNoValid: {
            emptyMsg: '请输入您的证件号',
            formatExg: /^[0-9a-zA-Z]{5,18}$/,
            formatMsg: '请输入正确的证件号'
        },
        phoneValid: {
            emptyMsg: '请输入您的手机号',
            formatExg: /^[0-9]{5,11}$/,
            formatMsg: '请输入正确的手机号'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            nameValidInfo: {
                showValidState: false,
                error: false,
                errorMsg: ''
            },
            cardNoValidInfo: {
                showValidState: false,
                error: false,
                errorMsg: ''
            },
            phoneValidInfo: {
                showValidState: false,
                error: false,
                errorMsg: ''
            },
            saveDisabled: true
        };
    }

    componentDidMount() {
        const pageParams = Router.getParams<AddEditConsignerPageParams>(this);

        if (!pageParams) {
            console.warn('[consigner-list]: 缺少页面传参.');
            return;
        }

        const { consigner } = pageParams;
        if (consigner) {
            this.setState({
                consigner,
                isLoaded: true,
                saveDisabled: false
            });
        } else {
            this.setState({
                isLoaded: true,
                saveDisabled: true
            });
        }
    }

    onNameChange = (name: string) => {
        this.setState(
            {
                consigner: assign(this.state.consigner, {
                    name
                })
            },
            this.setSaveDisableState
        );
        this.validName(name);
    };

    onNameBlur = (name: string) => {
        this.setState({
            nameValidInfo: assign(this.state.nameValidInfo, {
                showValidState: true
            })
        });

        this.validName(name);
    };

    validName = (name: string) => {
        let error = false;
        let errorMsg = '';
        const nameValid = this.FormValidDefined.nameValid;
        if (isEmpty(name)) {
            error = true;
            errorMsg = nameValid.emptyMsg;
        } else if (!nameValid.formatExg.test(name)) {
            error = true;
            errorMsg = nameValid.formatMsg;
        }

        this.setState({
            nameValidInfo: assign(this.state.nameValidInfo, {
                error,
                errorMsg
            })
        });

        return !error;
    };

    onTypeChange = (e) => {
        let index;
        // TODO
        // 我看在文档里picker事件都是从 e.detail中取的，所以这里存疑
        // https://taro-ui.aotu.io/#/docs/picker
        if(Environment.isWeb){
            index = e.detail.value;
        }else {
            index = e.target.value;
        }
        const credentialsTypeStr = CredentialsType[index].name;
        const credentialsType = CredentialsType[index].id;
        this.setState(
            {
                consigner: assign(this.state.consigner, {
                    credentialsTypeStr,
                    credentialsType
                })
            },
            this.setSaveDisableState
        );
    };

    onCardNoChange = (idCardNo: string) => {
        this.setState(
            {
                consigner: assign(this.state.consigner, {
                    idCardNo
                })
            },
            this.setSaveDisableState
        );

        this.validCardNo(idCardNo);
    };

    onCardNoBlur = (cardNo: string) => {
        this.setState({
            cardNoValidInfo: assign(this.state.cardNoValidInfo, {
                showValidState: true
            })
        });
        this.validCardNo(cardNo);
    };

    validCardNo = (cardNo: string) => {
        let error = false;
        let errorMsg = '';
        const cardNoValid = this.FormValidDefined.cardNoValid;
        if (isEmpty(cardNo)) {
            error = true;
            errorMsg = cardNoValid.emptyMsg;
        } else if (!cardNoValid.formatExg.test(cardNo)) {
            error = true;
            errorMsg = cardNoValid.formatMsg;
        }

        this.setState({
            cardNoValidInfo: assign(this.state.cardNoValidInfo, {
                error,
                errorMsg
            })
        });
        return !error;
    };

    onCountryChange = (e) => {
        let index;
        // TODO
        // 我看在文档里picker事件都是从 e.detail中取的，所以这里存疑
        // https://taro-ui.aotu.io/#/docs/picker
        if(Environment.isWeb){
            index = e.detail.value;
        }else {
            index = e.target.value;
        }
        const countryStr = Country[index].code;
        const countryId = Country[index].id;
        this.setState(
            {
                consigner: assign(this.state.consigner, {
                    countryStr,
                    countryId
                })
            },
            this.setSaveDisableState
        );
    };

    onMobilePhoneChange = (mobilephone: string) => {
        this.setState(
            {
                consigner: assign(this.state.consigner, {
                    mobilephone
                })
            },
            this.setSaveDisableState
        );

        this.validPhone(mobilephone);
    };

    onMobilePhoneBlur = (mobilephone: string) => {
        this.setState({
            phoneValidInfo: assign(this.state.phoneValidInfo, {
                showValidState: true
            })
        });
        this.validPhone(mobilephone);
    };

    validPhone = (phone: string) => {
        let error = false;
        let errorMsg = '';
        const phoneValid = this.FormValidDefined.phoneValid;
        if (isEmpty(phone)) {
            error = true;
            errorMsg = phoneValid.emptyMsg;
        } else if (!phoneValid.formatExg.test(phone)) {
            error = true;
            errorMsg = phoneValid.formatMsg;
        }

        this.setState({
            phoneValidInfo: assign(this.state.phoneValidInfo, {
                error,
                errorMsg
            })
        });
        return !error;
    };

    setSaveDisableState = () => {
        const { consigner } = this.state;
        if (
            this.validName(consigner.name) &&
            this.validCardNo(consigner.idCardNo) &&
            this.validPhone(consigner.mobilephone) &&
            consigner.countryId >= 0 &&
            consigner.credentialsType > 0
        ) {
            this.setState({
                saveDisabled: false
            });
        } else {
            this.setState({
                saveDisabled: true
            });
        }
    };

    onSaveConsigner = () => {
        const { consigner } = this.state;

        let _customer = {};

        if (consigner && consigner.id > 0) {
            _customer = {
                id: consigner.id,
                recipients: consigner.name,
                phone: consigner.mobilephone,
                credentialsType: consigner.credentialsType,
                cardNo: consigner.idCardNo,
                countryId: consigner.countryId,
                isDefault: consigner.isdefault === 1 ? true : false
            };
            this.editConsigner(_customer);
        } else if (consigner) {
            _customer = {
                recipients: consigner.name,
                phone: consigner.mobilephone,
                credentialsType: consigner.credentialsType,
                cardNo: consigner.idCardNo,
                countryId: consigner.countryId
            };
            this.addConsigner(_customer);
        }
    };

    addConsigner = (customer) => {
        ConsignerService.saveConsigner(customer).then((result) => {
            if (result.statusCode === 201) {
                Taro.eventCenter.trigger(EventCenter.consignerListUpdate);
                Router.back();
            } else {
                Taro.showToast({
                    title:
                        result.data && result.data.message
                            ? result.data.message
                            : '添加失败',
                    icon: 'none'
                });
            }
        });
    };

    editConsigner = (customer) => {
        ConsignerService.editConsigner(customer).then((result) => {
            if (result.statusCode === 200) {
                Taro.eventCenter.trigger(EventCenter.consignerListUpdate);
                Router.back();
            } else {
                Taro.showToast({
                    title:
                        result.data && result.data.message
                            ? result.data.message
                            : '修改失败',
                    icon: 'none'
                });
            }
        });
    };

    render() {
        const {
            consigner,
            nameValidInfo,
            cardNoValidInfo,
            phoneValidInfo,
            saveDisabled
        } = this.state;
        // 这里把接口传输的内容转为常量表的index
        // 如果类型和国籍字段数据内容不对的话 改这里就行，他下面都是用index的
        // 没找到就是undefined
        let credentialsTypeIndex: number = findIndex(CredentialsType, function(
            credentialsType
        ) {
            if (consigner) {
                return credentialsType.id == consigner.credentialsType;
            } else {
                return false;
            }
        });

        let credentialsTypeValue =
            credentialsTypeIndex >= 0 ? credentialsTypeIndex : undefined;

        // 和上面一样
        let countryIndex: number = findIndex(Country, function(country) {
            if (consigner) {
                return country.id == consigner.countryId;
            } else {
                return false;
            }
        });

        let countryValue = countryIndex >= 0 ? countryIndex : undefined;

        return (
            <View className='edit-customer-info'>
                {this.state.isLoaded ? (
                    <View className='customer-form'>
                        <CmInput
                            type='text'
                            title='姓名'
                            placeholder='请输入真实姓名'
                            value={consigner ? consigner.name : undefined}
                            onChange={this.onNameChange}
                            onBlur={this.onNameBlur}
                            showValidState={nameValidInfo.showValidState}
                            error={nameValidInfo.error}
                            errorMsg={nameValidInfo.errorMsg}
                        />
                        <View className='container'>
                            <Text className='title item'>证件类型:</Text>
                            <Picker
                                className='item'
                                mode='selector'
                                range={CredentialsType}
                                rangeKey='name'
                                value={credentialsTypeValue}
                                onChange={this.onTypeChange}
                                options={CredentialsType}
                            >
                                <Text
                                    className={classnames('picker-value', {
                                        placeholder: isUndefined(
                                            credentialsTypeValue
                                        )
                                    })}
                                >
                                    {!isUndefined(credentialsTypeValue)
                                        ? CredentialsType[credentialsTypeValue][
                                              'name'
                                          ]
                                        : '请选择出入境时的有效证件'}
                                </Text>
                            </Picker>
                            <View className='item down-icon cm-icon icon-arrow-down-outline' />
                        </View>
                        <CmInput
                            type='text'
                            title='证件号'
                            placeholder='请输入出入境时有效证件号码'
                            value={consigner ? consigner.idCardNo : undefined}
                            onChange={this.onCardNoChange}
                            onBlur={this.onCardNoBlur}
                            showValidState={cardNoValidInfo.showValidState}
                            error={cardNoValidInfo.error}
                            errorMsg={cardNoValidInfo.errorMsg}
                        />
                        <View className='container'>
                            <Text className='title item'>国籍:</Text>
                            <Picker
                                className='item'
                                mode='selector'
                                range={Country}
                                rangeKey='name'
                                value={countryValue}
                                onChange={this.onCountryChange}
                                options={Country}
                            >
                                <Text
                                    className={classnames('picker-value', {
                                        placeholder: isUndefined(countryValue)
                                    })}
                                >
                                    {!isUndefined(countryValue)
                                        ? Country[countryValue]['name']
                                        : '请选择国家/地区'}
                                </Text>
                            </Picker>
                            <View className='item down-icon cm-icon icon-arrow-down-outline' />
                        </View>
                        <CmInput
                            type='number'
                            title='手机号'
                            placeholder='请输入手机号'
                            value={
                                consigner ? consigner.mobilephone : undefined
                            }
                            onChange={this.onMobilePhoneChange}
                            onBlur={this.onMobilePhoneBlur}
                            showValidState={phoneValidInfo.showValidState}
                            error={phoneValidInfo.error}
                            errorMsg={phoneValidInfo.errorMsg}
                        />
                        <CmButton
                            className='save-button'
                            type='sharp'
                            onClick={this.onSaveConsigner}
                            disabled={saveDisabled}
                        >
                            保存提货人信息
                        </CmButton>
                    </View>
                ) : (
                    ''
                )}
            </View>
        );
    }
}
