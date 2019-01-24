import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { find } from 'lodash';
import { ICheckoutConsigner } from '../../../interfaces/consigner';
import { Country } from '../../../constants';
import { Router } from '../../../services';

import './index.scss';

interface ConsignerProps {
    consigner?: ICheckoutConsigner;
}

export default class CheckoutConsigner extends Component<ConsignerProps> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    toConsigneeList = () => {
        let { consigner } = this.props;
        Router.navigate('consigner-list', consigner);
    };

    render() {
        let { consigner } = this.props;

        let country = find(Country, function(tempCountry) {
            if (consigner) {
                return consigner.countryId === tempCountry.id;
            }
        });
        if (consigner && country && typeof country != 'number') {
            consigner.countryStr = country.name;
        }

        let _consigner = consigner;

        return (
            <View className='consignee' onClick={this.toConsigneeList}>
                {_consigner && _consigner.id > 0 ? (
                    <View className='consignee-detail'>
                        <View className='consignee-icon cm-icon icon-position-outline' />
                        <View className='condignee-info'>
                            <View>
                                <Text>提货人：</Text>
                                <Text className='consignee-name'>
                                    {_consigner.name}
                                </Text>
                            </View>
                            <View className='condignee-info-text'>
                                <View className='cm-icon icon-phone-outline' />
                                <Text className='text'>
                                    {_consigner.mobile}
                                </Text>
                            </View>
                            <View className='condignee-info-text'>
                                <View className='cm-icon icon-idcard-outline' />
                                <Text className='text'>
                                    {_consigner.cardNo}
                                </Text>
                            </View>
                            <View className='condignee-info-text'>
                                <Text>国籍：</Text>
                                <Text>{_consigner.countryStr}</Text>
                            </View>
                        </View>
                        <View className='condignee-icon-arrow cm-icon icon-arrow-right-outline' />
                    </View>
                ) : (
                    <View className='consignee-empty'>
                        <Text className='add-icon'>+</Text>
                        <Text>请添加提货人</Text>
                    </View>
                )}
            </View>
        );
    }
}
