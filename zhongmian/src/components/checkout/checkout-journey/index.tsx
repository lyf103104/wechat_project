import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { isEmpty } from 'lodash';
import { Router } from '../../../services';
import './index.scss';

interface CheckoutJourneyProps {
    flightNo: string;
}

export default class CheckoutJourney extends Component<CheckoutJourneyProps> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    editJourney = () => {
        const { flightNo } = this.props;

        Router.navigate('edit-journey-info', {
            flightNo
        });
    };

    render() {
        const { flightNo } = this.props;
        return (
            <View className='checkout-journey'>
                <View className='hr-fusion' />
                {flightNo && !isEmpty(flightNo) ? (
                    <View
                        className='journey-info-box'
                        onClick={this.editJourney}
                    >
                        <View className='row journey-info'>
                            <View className='col col-center col-adaptive'>
                                <View className='flight-icon cm-icon icon-flight-outline' />
                            </View>
                            <Text className='col flight-text'>
                                航班号:
                                {flightNo}
                            </Text>
                            <View className='col col-adaptive col-center'>
                                <View className='arrow-icon cm-icon icon-arrow-right-outline-black' />
                            </View>
                        </View>
                    </View>
                ) : (
                    <View
                        className='journey-empty-box'
                        onClick={this.editJourney}
                    >
                        <View className='journey-empty'>
                            <View className='journey-icon cm-icon icon-flight-outline' />
                            <Text>请添加行程</Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}
