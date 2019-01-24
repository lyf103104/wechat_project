/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[BaseEventFunction]" }]*/
import Taro, { Component } from '@tarojs/taro';
import { BaseEventFunction } from '@tarojs/components/types/common';
import { View, Button } from '@tarojs/components';
import classnames from 'classnames';
import './index.scss';

const TYPE_CLASS = {
    text: 'text',
    sharp: 'sharp',
    outline: 'outline',
    'sharp-outline': 'sharp-outline'
};

const SIZE_CLASS = {
    normal: 'normal',
    small: 'small'
};

const THEME_CLASS = {
    default: 'default',
    primary: 'primary',
    grey: 'grey'
};

interface CmButtonProps {
    size?: 'normal' | 'small';

    type?: 'default' | 'text' | 'sharp' | 'outline' | 'sharp-outline';

    theme?: 'default' | 'primary' | 'grey';

    circle?: boolean;

    loading?: boolean;

    disabled?: boolean;

    className?: string | Array<string>;

    customStyle?: any;

    onClick?: (ev?: BaseEventFunction) => any;

    // start Button props
    formType?: 'submit' | 'reset';
    openType?:
        | 'contact'
        | 'share'
        | 'getUserInfo'
        | 'getPhoneNumber'
        | 'launchApp'
        | 'openSetting'
        | 'feedback'
        | 'getRealnameAuthInfo';
    lang?: string;
    sessionFrom?: string;
    sendMessageTitle?: string;
    sendMessagePath?: string;
    sendMessageImg?: string;
    showMessageCard?: boolean;
    appParameter?: string;
    onGetUserInfo?: (ev?: BaseEventFunction) => any;
    onContact?: (ev?: BaseEventFunction) => any;
    onGetPhoneNumber?: (ev?: BaseEventFunction) => any;
    onError?: (ev?: BaseEventFunction) => any;
    onOpenSetting?: (ev?: BaseEventFunction) => any;
}

export default class CmButton extends Component<CmButtonProps> {
    static options = { addGlobalClass: true };

    static defaultProps = {
        size: 'normal',
        type: 'default',
        theme: 'primary',
        circle: false,
        loading: false,
        disabled: false,
        customStyle: {},
        onClick: () => {},
        lang: 'en',
        sessionFrom: '',
        sendMessageTitle: '',
        sendMessagePath: '',
        sendMessageImg: '',
        showMessageCard: false,
        appParameter: '',
        onGetUserInfo: () => {},
        onContact: () => {},
        onGetPhoneNumber: () => {},
        onError: () => {},
        onOpenSetting: () => {}
    }; // Button props

    constructor(props) {
        super(props);
    }

    onClick = (...args) => {
        if (!this.props.disabled) {
            this.props.onClick && this.props.onClick(...args);
        }
    };

    onGetUserInfo = (...args) => {
        this.props.onGetUserInfo && this.props.onGetUserInfo(...args);
    };

    onContact = (...args) => {
        this.props.onContact && this.props.onContact(...args);
    };

    onGetPhoneNumber = (...args) => {
        this.props.onGetPhoneNumber && this.props.onGetPhoneNumber(...args);
    };

    onError = (...args) => {
        this.props.onError && this.props.onError(...args);
    };

    onOpenSetting = (...args) => {
        this.props.onOpenSetting && this.props.onOpenSetting(...args);
    };

    render() {
        const {
            size = 'normal',
            type = 'default',
            theme = 'primary',
            circle,
            disabled,
            customStyle,
            className,
            formType,
            openType,
            lang,
            sessionFrom,
            sendMessageTitle,
            sendMessagePath,
            sendMessageImg,
            showMessageCard,
            appParameter
        } = this.props;

        let rootClassName: string = classnames('cm-button', className, {
            [`cm-button-type-${type}`]: TYPE_CLASS[type],
            [`cm-button-size-${size}`]: SIZE_CLASS[size],
            [`cm-button-theme-${theme}`]: THEME_CLASS[theme],
            'cm-button-disabled': disabled,
            'cm-button-circle': circle
        });
        return (
            <View
                className={rootClassName}
                style={customStyle}
                onClick={this.onClick}
            >
                {!disabled && (
                    <Button
                        className='cm-button-wxbutton'
                        formType={formType}
                        openType={openType}
                        lang={lang}
                        sessionFrom={sessionFrom}
                        sendMessageTitle={sendMessageTitle}
                        sendMessagePath={sendMessagePath}
                        sendMessageImg={sendMessageImg}
                        showMessageCard={showMessageCard}
                        appParameter={appParameter}
                        onGetUserInfo={this.onGetUserInfo}
                        onGetPhoneNumber={this.onGetPhoneNumber}
                        onOpenSetting={this.onOpenSetting}
                        onError={this.onError}
                        onContact={this.onContact}
                    />
                )}
                <View className='cm-button-content'>{this.props.children}</View>
            </View>
        );
    }
}
