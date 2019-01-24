import Taro, { Component } from '@tarojs/taro';
import { ScrollView } from '@tarojs/components';
import { forEach } from 'lodash';
import Consigner from '../consigner';
import { IConsignerListConsigner } from '../../interfaces';
import './index.scss';

interface ConsignerListProps {
    consigners: Array<IConsignerListConsigner>;
    onClick: (consigner: IConsignerListConsigner) => any;
    onDelete: (consigner: IConsignerListConsigner) => any;
    onEdit: (consigner: IConsignerListConsigner) => any;
    onSetDefault: (consigner: IConsignerListConsigner) => any;
    onHandleSingleCallBack: (items: Array<IConsignerListConsigner>) => void;
}

export default class ConsignerList extends Component<ConsignerListProps> {
    constructor(props) {
        super(props);
    }

    onSelect = (consigner: IConsignerListConsigner) => {
        this.props.onClick && this.props.onClick(consigner);
    };

    onDelete = (consigner: IConsignerListConsigner) => {
        this.props.onDelete && this.props.onDelete(consigner);
    };

    onEdit = (consigner: IConsignerListConsigner) => {
        this.props.onEdit && this.props.onEdit(consigner);
    };

    onSetDefault = (consigner: IConsignerListConsigner) => {
        this.props.onSetDefault && this.props.onSetDefault(consigner);
    };

    handleSingle(consignerId: number) {
        const { consigners, onHandleSingleCallBack } = this.props;
        forEach(consigners, function(consigner) {
            if (consignerId != consigner.id) {
                consigner.isClose = true;
            } else {
                consigner.isClose = false;
            }
        });
        onHandleSingleCallBack(consigners);
    }

    render() {
        const { consigners } = this.props;
        if (!consigners || consigners.length <= 0) return;
        const list = consigners.map((consigner, index) => {
            let isLast = index === consigners.length - 1;
            return (
                <Consigner
                    key={consigner.id}
                    consigner={consigner}
                    onClick={this.onSelect}
                    onDelete={this.onDelete}
                    onEdit={this.onEdit}
                    onSetDefault={this.onSetDefault}
                    onHandleSingle={this.handleSingle.bind(this, consigner.id)}
                    isLast={isLast}
                />
            );
        });
        return <ScrollView className='consigner-list'>{list}</ScrollView>;
    }
}
