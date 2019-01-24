import IProduct from './product';
import { IAmount } from './index';

interface ICart {
    cartId: string;
    type: number;
    reminder: Array<string>;
    cartNormalProduct: Array<ICartComponentItem>;
    limitCondition: string;
    amount: IAmount;
}

interface ICartItem extends IProduct {
    cartId: number;
    basketId: number;
    itemId: number;
    goodsId: number;
    productId: number;
    warehouseId: number;
    valid: boolean;
    isValid: boolean;
    amount: number;
    price: string;
    sellCount: number;
}

interface ICartComponentItem extends ICartItem {
    /**
     * 左划是否关闭
     */
    isClose?: boolean;
}

export { ICart, ICartItem, ICartComponentItem };
