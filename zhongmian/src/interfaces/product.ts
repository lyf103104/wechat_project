import IPrice from './price';

export default interface IProduct {
    id: number;
    pic: string;
    name: string;
    styleNames?: Array<string> | null;
    salesPrice: IPrice;
    contrastPrice?: IPrice;
    discountPrice?: IPrice;
}
