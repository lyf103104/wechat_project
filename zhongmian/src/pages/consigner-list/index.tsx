/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[I]" }]*/
import Taro, { Component, Config } from '@tarojs/taro';
import { Text, View } from '@tarojs/components';
import { ConsignerList, CmButton } from '../../components';
import { Router, ConsignerService } from '../../services';
import { EventCenter } from '../../constants';
import { IConsignerListConsigner, ICheckoutConsigner } from '../../interfaces';
import './index.scss';

interface consignerListState {
    consigners: Array<IConsignerListConsigner>;
    selectedConsigner: IConsignerListConsigner;
}

export default class Index extends Component<any, consignerListState> {
    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '选择提货人'
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let selectedConsigner = Router.getParams<ICheckoutConsigner>(this);
        if (selectedConsigner) {
            const consigner = ConsignerService.transformICheckoutConsignerToIConsignerListConsigner(
                selectedConsigner
            );
            this.setState({ selectedConsigner: consigner });
        }

        Taro.eventCenter.on(EventCenter.consignerListUpdate, () => {
            this.loadConsigners();
        });
        this.loadConsigners();
    }

    componentWillUnmount() {
        Taro.eventCenter.off(EventCenter.consignerListUpdate);
    }

    loadConsigners = async () => {
        try {
            let result = await ConsignerService.getConsignees();
            if (result.statusCode === 200) {
                const { selectedConsigner } = this.state;
                const consigners = result.data.valid_address_list;
                consigners.forEach((consigner) => {
                    if (
                        selectedConsigner &&
                        consigner.id === selectedConsigner.id
                    ) {
                        consigner.checked = true;
                    } else {
                        consigner.checked = false;
                    }
                });

                this.setState({
                    consigners
                });
            }
        } catch (error) {
            Taro.showToast({
                title: '网络繁忙，请稍后重试',
                icon: 'none'
            });
        }
    };

    onConsignerClick = (selectedConsigner: IConsignerListConsigner) => {
        const consigner = ConsignerService.transformIConsignerListConsignerToICheckoutConsigner(
            selectedConsigner
        );
        Taro.eventCenter.trigger(
            EventCenter.checkoutConsignerUpdate,
            consigner
        );
        Router.back();
    };

    onAddConsigner = () => {
        Router.navigate('edit-consigner-info');
    };

    onDeleteConsigner = async (consigner: IConsignerListConsigner) => {
        await ConsignerService.deleteConsigner(consigner.id);
        const { selectedConsigner } = this.state;

        if (consigner.id === selectedConsigner.id) {
            Taro.eventCenter.trigger(EventCenter.checkoutConsignerUpdate, null);
        }
        this.loadConsigners();
    };

    onEditConsigner = (consigner: IConsignerListConsigner) => {
        Router.navigate('edit-consigner-info', { consigner });
    };

    onSetDefaultConsigner = async (consigner: IConsignerListConsigner) => {
        await ConsignerService.setConsignerDefault(consigner.id);
        this.loadConsigners();
    };

    handleSingleCallBack = (consigners: Array<IConsignerListConsigner>) => {
        this.setState({
            consigners
        });
    };

    render() {
        const { consigners } = this.state;
        return (
            <View className='consigners'>
                <CmButton
                    className='add-consigner'
                    type='sharp'
                    onClick={this.onAddConsigner}
                >
                    <Text className='add-icon'>+</Text>
                    <Text>请添加提货人</Text>
                </CmButton>
                <View className='gray-bar' />
                {consigners && consigners.length === 0 ? (
                    <View className='consigners-empty'>
                        <View className='image-box'>
                            <View className='img-position' />
                        </View>
                        <View className='text'>暂无提货人信息</View>
                    </View>
                ) : (
                    <ConsignerList
                        consigners={consigners}
                        onClick={this.onConsignerClick}
                        onDelete={this.onDeleteConsigner}
                        onEdit={this.onEditConsigner}
                        onSetDefault={this.onSetDefaultConsigner}
                        onHandleSingleCallBack={this.handleSingleCallBack}
                    />
                )}
            </View>
        );
    }
}
