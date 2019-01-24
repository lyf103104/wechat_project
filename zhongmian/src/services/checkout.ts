import { ApiService } from '.';
import { IChekcout, ICheckoutDiscount, responseData, IPayment } from '../interfaces';

interface UpdateCheckoutParams {
    consigneeId: number;
    flightNo: string;
    discountType: number;
    groupGuestCode: string | null;
}

interface CreateOrderParams {
    consigneeId: number;
    couponIds: string;
    paymentModeType: number;
    payableAmount: string;
    needInvoice: number;
    cartToken: string;
    paymentMethod: number;
    deliveryModeIdStr: string;
    discountTypeId: number;
    flightNo: string;
    groupGuestCode: string | null;
}

interface UseCouponParams {
    consigneeId: number;
    couponIds: Array<number>;
}
class CheckoutService {
    public getCheckoutInfo(): Promise<Taro.request.Promised<IChekcout>> {
        return ApiService.post<IChekcout>('/checkout/freeshopping');
    }

    public getCheckoutDiscounts(
        groupGuestCode?
    ): Promise<Taro.request.Promised<Array<ICheckoutDiscount>>> {
        return ApiService.get('/members/discounttype', {
            groupGuestCode
        });
    }

    public updateCheckoutInfo(params: UpdateCheckoutParams): Promise<any> {
        return ApiService.put('/checkout/freeshopping/mine', params);
    }

    public getPaymentInfo(orderId: string): Promise<responseData<IPayment>> {
        let params = { orderId, payModeId: 227 };
        return ApiService.get('/payments/{orderId}/payment', params);
    }

    public createOrder(params: CreateOrderParams): Promise<any> {
        const config = {
            header: {
                'content-type': 'application/json'
            }
        };
        return ApiService.post('/orders/freeshopping', params, config);
    }

    public async getCouponList(): Promise<any> {
        return ApiService.get('/checkout/freeshopping/mine/aviliableCoupons');
    }

    public async useCoupon(params: UseCouponParams): Promise<any> {
        return ApiService.put('/checkout/freeshopping/mine/coupons', params);
    }

    public confirmGroupCode(
        groupGuestCode
    ): Promise<Taro.request.Promised<any>> {
        return ApiService.get('/checkout/mine/code/{groupGuestCode}', {
            groupGuestCode
        });
    }
}

export default new CheckoutService();
