import { IAmount } from './amount';
import IPrice from './price';
import IProduct from './product';

/**
 * 订单列表、订单详情应为同一个订单对象，现差异较大。可视为不同对象。
 */
interface IOrder {
    buyagain: number;
    paymodeName: string;
}

interface IOrderProduct extends IProduct {
    goodsId: number;
    warehouseId: number;
    value: string;
    count: number;
}

/**
 *  IOrderList
 */

interface IOrderList extends IOrder {
    cancelorder: number;
    contactService: number;
    count: number;
    followorder: number;
    ladingCodeStatus: number;
    orderId: number;
    orderNo_button: boolean;
    orderType: string;
    orderproducts: Array<IOrderProduct>;
    payablePrice: string;
    payorder: number;
    receiveName: string;
    showid: string;
    status: string;
    statusId: number;
    subSiteName: string;
    time: string;
    totalPrice: string;
    warehouseName: string;
}

interface IFlightInfo {
    flightNo: string;
}

interface IOrderBaseInfo {
    card_payway: boolean;
    contactService: number;
    order_aliascode: string;
    order_creattime: string;
    order_status: string;
    payablePrice: string;
    totalPrice: string;
    invoice: string;
    ladingCodeStatus: number;
    statusId: number;
}

interface IOrderInfoProduct {
    pro_name: string;
    pro_pic: string;
    product_id: string;
    goods_id: string;
    warehouse_id: string;
    product_amount: string;
    product_weight: string;
    exchangeProduct: boolean;
    trade_price: IPrice;
    styleNames: Array<string> | null;
    salesPrice: IPrice;
    contrastPrice: IPrice;
    discountPrice: string;
    totalPrice: string;
    brandId: number;
    parcelTax: string;
}

interface IOrderReceiveInfo {
    address: string;
    certId: string;
    credentialsNum: string;
    credentialsType: string;
    name: string;
    nationalityName: string;
    phone: string;
}

interface pickingGoods_info {
    deliveryPoint: string;
    entryExitType: number;
    pickingGoodsAddress: string;
    pickingGoodsAddressPic: string;
    pickingGoodsBusiness: string;
    pickingGoodsTime: string;
}

/**
 *  IOrderInfo
 */
interface IOrderInfo extends IOrder {
    amount: IAmount;
    autoCancelTime: number;
    cancel_button: boolean;
    flightInfo: IFlightInfo;
    invoice_title: string;
    invoice_context: string;
    orderNo_button: boolean;
    orderdetail_info: IOrderBaseInfo;
    orderdetail_productlist: Array<IOrderInfoProduct>;
    orderdetail_receiveinfo: IOrderReceiveInfo;
    orderid: number;
    pay_button: boolean;
    paymodeid: boolean;
    pickingGoods_info: pickingGoods_info;
}

export { IOrderList, IOrderInfo };
