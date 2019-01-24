interface ICheckoutAmount {
    productTotalAmount: string;
    couponDiscountAmount: string;
    discountAmount: string;
    parcelTaxAmount: string;
    parcelTaxDiscountAmount: string;
    payableAmount: string;
}

interface IAmount extends ICheckoutAmount {
    productQuantity: number;
}

export { ICheckoutAmount, IAmount };
