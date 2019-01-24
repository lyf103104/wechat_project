import Taro, { Component } from '@tarojs/taro';
import { View, Text, Radio } from '@tarojs/components';
import { BaseEventFunction } from '@tarojs/components/types/common';
import { AtSwipeAction } from 'taro-ui';
import classnames from 'classnames';
import { find } from 'lodash';
import { Country, CredentialsType } from '../../constants';
import { IConsignerListConsigner } from '../../interfaces';
import './index.scss';

interface ConsignerProps {
    consigner: IConsignerListConsigner;
    onClick: (consigner: IConsignerListConsigner) => void;
    onEdit?: (consigner: IConsignerListConsigner) => void;
    onSetDefault?: (consigner: IConsignerListConsigner) => void;
    onDelete?: (consigner: IConsignerListConsigner) => void;
    onHandleSingle: BaseEventFunction;
    isLast?: boolean;
}

export default class Consigner extends Component<ConsignerProps> {
    static options = { addGlobalClass: true };

    itemSwipeOptions = [
        {
            text: '设为默认',
            style: {
                backgroundColor: '#fff',
                color: '#666',
                border: '1px solid #eee'
            },
            action: (consigner) => {
                // light
                this.props.onSetDefault && this.props.onSetDefault(consigner);
            }
        },
        {
            text: '编辑',
            style: { backgroundColor: '#eee', color: '#666' },
            action: (consigner) => {
                // stable
                this.props.onEdit && this.props.onEdit(consigner);
            }
        },
        {
            text: '删除',
            style: { backgroundColor: '#c67a47' },
            action: (consigner) => {
                // primary
                this.props.onDelete && this.props.onDelete(consigner);
            }
        }
    ];

    constructor(props) {
        super(props);
    }

    onClick = () => {
        this.props.onClick && this.props.onClick(this.props.consigner);
    };

    handleMenuClick = (useless, index) => {
        const option = this.itemSwipeOptions[index];
        if (option) {
            option.action && option.action(this.props.consigner);
        }
    };

    render() {
        let { consigner, isLast, onHandleSingle } = this.props;

        let radioClassName: string = classnames('checked-radio', {
            checked: consigner && consigner.checked
        });

        let swipeActionOptions = this.itemSwipeOptions;
        // 选中的提货人不能删除
        if (consigner && consigner.checked) {
            swipeActionOptions = swipeActionOptions.slice(0, 2);
        }

        let credentialsType = find(CredentialsType, function(
            tempCredentialsType
        ) {
            return (
                consigner &&
                consigner.credentialsType === tempCredentialsType.id
            );
        });
        if (credentialsType) {
            consigner.credentialsTypeStr = credentialsType.name;
        }

        let country = find(Country, function(tempCountry) {
            return consigner && consigner.countryId === tempCountry.id;
        });
        if (country) {
            consigner.countryStr = country.name;
        }

        let _consigner = consigner;

        let autoClose = true;

        return (
            <AtSwipeAction
                onClick={this.handleMenuClick}
                autoClose={autoClose}
                options={swipeActionOptions}
                isClose={consigner.isClose}
                onOpened={onHandleSingle}
            >
                <View
                    className={'consigner-item' + (isLast ? ' last-child' : '')}
                    onClick={this.onClick}
                >
                    <View className='consigner-checked'>
                        <Radio
                            className={radioClassName}
                            checked={_consigner ? _consigner.checked : false}
                            value={
                                _consigner ? _consigner.checked.toString() : ''
                            }
                        />
                    </View>
                    <View>
                        <View className='line'>
                            <Text>提货人:</Text>
                            <Text className='name'>{_consigner.name}</Text>
                            {_consigner.isdefault === 1 ? (
                                <Text className='default'>默认</Text>
                            ) : (
                                ''
                            )}
                        </View>
                        <View className='line'>
                            <View className='cm-icon icon-phone-outline-black' />
                            <Text className='mobilephone'>
                                {_consigner.mobilephone}
                            </Text>
                        </View>
                        <View className='line'>
                            <View className='cm-icon icon-idcard-outline-black' />
                            <Text className='credentials'>
                                {_consigner.credentialsTypeStr +
                                    ' ' +
                                    _consigner.idCardNo +
                                    ' ' +
                                    _consigner.countryStr}
                            </Text>
                        </View>
                    </View>
                </View>
            </AtSwipeAction>
        );
    }
}
