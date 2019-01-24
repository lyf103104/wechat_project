import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { IOrderInfo } from '../../../interfaces';
import './index.scss';

interface OrderProps {
    order: IOrderInfo;
}

export default class OrderReceiveInfo extends Component<OrderProps, any> {
    static options = { addGlobalClass: true };

    constructor(props) {
        super(props);
    }

    render() {
        const { order } = this.props;
        if (!order) return;
        const phone = order.orderdetail_receiveinfo.phone;
        const _phone = phone.substr(0, 3) + '****' + phone.substr(7);

        return (
            <View className='order-receive-info'>
                <View className='info-title'>乘机人信息</View>
                <View className='info-row'>
                    姓名：
                    {order.orderdetail_receiveinfo.name}
                </View>
                <View className='info-row'>
                    国籍：
                    {order.orderdetail_receiveinfo.nationalityName}
                </View>
                <View className='info-row'>
                    手机号码：
                    {_phone}
                </View>
                <View className='info-row'>
                    证件类型：
                    {order.orderdetail_receiveinfo.credentialsType}
                </View>
                <View className='info-row'>
                    证件号：
                    {order.orderdetail_receiveinfo.certId}
                </View>
                <View className='info-row'>
                    航班号：
                    {order.flightInfo.flightNo}
                </View>
            </View>
        );
    }
}
