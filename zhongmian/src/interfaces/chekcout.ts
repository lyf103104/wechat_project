import { ICheckoutConsigner } from './consigner';
import { IAmount } from './amount';
import IProduct from './product';

interface IChekcout {
    adress_default: ICheckoutConsigner;
    amount: IAmount;
    cartId: string;
    cartToken: string;
    disableSubmit: boolean;
    flight_default: null;
    isCallZHX: number;
    ownDeliverys: null;
    paymodes: string;
    paywayInfoList: Array<IPayway>;
    presentProductList: null;
    productList: Array<IProduct>;
    reminder: string;
    totalUseAbleCard: number;
    type: number;
}

interface IPayway {
    descript: string;
    id: string;
    installmentList: null;
    price: null;
    show: boolean;
    title: null;
    type: number;
}

interface ICheckoutDiscount {
    id: number;
    descript: string;
}

export { IChekcout, IPayway, ICheckoutDiscount };
