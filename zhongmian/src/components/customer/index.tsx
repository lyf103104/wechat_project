import Taro, { Component } from '@tarojs/taro';
import { ICustomer } from '../../interfaces';
import { View, Text, Radio } from '@tarojs/components';
import { Country, CredentialsType } from '../../constants';
import { AtSwipeAction } from 'taro-ui';
import { find } from 'lodash';
import './index.scss';

interface CustomerProps {
    customer: ICustomer;
    onClick: (customer: ICustomer) => void;
    onEdit?: (customer: ICustomer) => void;
    onSetDefault?: (customer: ICustomer) => void;
    onDelete?: (customer: ICustomer) => void;
    isLast?: boolean;
}

export class Customer extends Component<CustomerProps, any> {
    static options = { addGlobalClass: true };

    private _ItemSwipeOptions = [
        {
            text: '设为默认',
            style: {
                backgroundColor: '#fff',
                color: '#666',
                border: '1px solid #eee'
            },
            action: (customer) => {
                // light
                this.props.onSetDefault && this.props.onSetDefault(customer);
            }
        },
        {
            text: '编辑',
            style: { backgroundColor: '#eee', color: '#666' },
            action: (customer) => {
                // stable
                this.props.onEdit && this.props.onEdit(customer);
            }
        },
        {
            text: '删除',
            style: { backgroundColor: '#c67a47' },
            action: (customer) => {
                // primary
                this.props.onDelete && this.props.onDelete(customer);
            }
        }
    ];
    constructor(props) {
        super(props);
    }

    onClick = () => {
        this.props.onClick && this.props.onClick(this.props.customer);
    };

    handleMenuClick = (useless, index) => {
        const option = this._ItemSwipeOptions[index];
        if (option) {
            option.action && option.action(this.props.customer);
        }
    };

    render() {
        let { customer, isLast } = this.props;

        let swipeActionOptions = this._ItemSwipeOptions;
        // 选中的提货人不能删除
        if (customer.checked) {
            swipeActionOptions.pop();
        }
        const _country = Country;
        const _credentialsType = CredentialsType;

        let credentialsType = find(_credentialsType, function(credentialsType) {
            return customer.credentialsType == credentialsType.id;
        });

        customer.credentialsTypeStr = credentialsType.name;

        let country = find(_country, function(country) {
            return customer.countryId == country.id;
        });
        customer.countryStr = country.name;

        let _customer = customer;

        return (
            <AtSwipeAction
                onClick={this.handleMenuClick}
                autoClose={true}
                options={swipeActionOptions}
            >
                <View
                    className={'customer-item' + (isLast ? ' last-child' : '')}
                    onClick={this.onClick}
                >
                    <View className='customer-checked'>
                        <Radio color='#c67a47' checked={_customer.checked} />
                    </View>
                    <View>
                        <View className='line'>
                            <Text>提货人:</Text>
                            <Text className='name'>{_customer.name}</Text>
                            {_customer.isdefault === 1 ? (
                                <Text className='default'>默认</Text>
                            ) : (
                                ''
                            )}
                        </View>
                        <View className='line'>
                            <View className='cm-icon icon-phone-outline-black' />
                            <Text className='mobilephone'>
                                {_customer.mobilephone}
                            </Text>
                        </View>
                        <View className='line'>
                            <View className='cm-icon icon-idcard-outline-black' />
                            <Text className='credentials'>
                                {_customer.credentialsTypeStr +
                                    ' ' +
                                    _customer.cardNo +
                                    ' ' +
                                    _customer.countryStr}
                            </Text>
                        </View>
                    </View>
                </View>
            </AtSwipeAction>
        );
    }
}
