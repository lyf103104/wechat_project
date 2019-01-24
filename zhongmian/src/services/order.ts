import { responsePages, IOrderInfo, IOrderList } from '../interfaces';
import { ApiService } from '.';

/**
 * 订单列表请求参数
 */
interface OrderListParams {
    type: number;
    count: number;
    page: number;
}

/**
 * 订单列表返回信息
 */
interface OrderListResponse<T> extends responsePages<T> {
    orders_list: Array<T>;
    total_count: number;
}

/**
 * 全局配置信息
 */
interface PlatformInformation {
    appLogoUrl: string;
    homeLogoUrl: string;
    userBackgroundImage: string;
    /**
     * 官网客服电话
     */
    servicePhone: string;
    serviceTime: string;
    helpCenterId: string;
}

class OrderService {
    public getMineOrders(
        params: OrderListParams
    ): Promise<Taro.request.Promised<OrderListResponse<IOrderList>>> {
        return ApiService.get<OrderListResponse<IOrderList>>(
            '/orders/freeshopping/mine',
            params
        );
    }

    public getOrderInfo(
        id: number
    ): Promise<Taro.request.Promised<IOrderInfo>> {
        return ApiService.get<IOrderInfo>('/orders/freeshopping/{id}', { id });
    }

    public cancelOrder(id: number): Promise<any> {
        return ApiService.put('/orders/freeshopping/{id}/canceled', { id });
    }

    public getPlatform(): Promise<Taro.request.Promised<PlatformInformation>> {
        return ApiService.get('platformInformation');
    }
}

export default new OrderService();
