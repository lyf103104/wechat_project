import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { isEmpty } from 'lodash';
import './index.scss';

interface CmInputProps {
    title: string;
    type: 'text' | 'number';
    value: string | undefined;
    placeholder: string;
    showValidState?: boolean;
    error?: boolean;
    errorMsg?: string;
    separator?: string;
    onChange?: (...value: any) => void;
    onBlur?: (...value: any) => void;
    onFocus?: (...value: any) => void;
}

export default class CmInput extends Component<CmInputProps, any> {
    static options = { addGlobalClass: true };

    static defaultProps = {
        type: 'text',
        separator: ':',
        showValidState: false,
        error: false
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.state = {
            focus: false
        };
    }

    onChange(event) {
        this.props.onChange && this.props.onChange(event.target.value);
    }

    onBlur(event) {
        this.setState({
            focus: false
        });
        this.props.onBlur && this.props.onBlur(event.target.value);
    }

    onFocus(event) {
        this.setState({
            focus: true
        });
        this.props.onFocus && this.props.onFocus(event.target.value);
    }

    render() {
        let { focus } = this.state;
        const { showValidState, error, errorMsg } = this.props;
        return (
            <View className='cm-input'>
                <Text className='item title'>
                    {this.props.title}
                    {this.props.separator}
                </Text>
                <Input
                    className='item input'
                    type={this.props.type}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    placeholderClass='placeholder'
                    onInput={this.onChange}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                />
                {showValidState && error ? (
                    <View className='item icon cm-icon icon-error' />
                ) : (
                    ''
                )}
                {showValidState && error && focus && !isEmpty(errorMsg) ? (
                    <Text className='error-msg'>{errorMsg}</Text>
                ) : (
                    ''
                )}

                {showValidState && !error ? (
                    <View className='item icon cm-icon icon-check' />
                ) : (
                    ''
                )}
            </View>
        );
    }
}
