import { ApiService } from '../services';
import { ICart, ICartComponentItem } from '../interfaces';

interface AddToCartParams {
    barCode: string;
    amount: number;
}

interface ChangeCartProductQuantityParams {
    itemId: number;
    goodsId: number;
    quantity: number;
}

interface DeleteCartItemParams {
    itemId: number;
}

class CartService {
    public getMineFreesShoppingCart(): Promise<Taro.request.Promised<ICart>> {
        return ApiService.get<ICart>('/carts/freeshopping/mine').then(function(
            response
        ) {
            if (response.statusCode === 200) {
                response.data.cartNormalProduct.forEach(function(
                    item: ICartComponentItem
                ) {
                    item.isClose = true;
                });
            }
            return response;
        });
    }

    public addToCart(params: AddToCartParams): Promise<void> {
        return new Promise((resolve, reject) => {
            // 这个接口没有response,他只会通过httpStatucCode表示状态，所以这里要处理一下，保证业务层整洁
            ApiService.post('/carts/freeshopping/mine/items', params, {
                responseType: 'none',
                dataType: 'none',
                complete: (res) => {
                    if (res.statusCode === 201) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    public changeCartItemQuantity(
        params: ChangeCartProductQuantityParams
    ): Promise<any> {
        return ApiService.put(
            '/carts/freeshopping/mine/items/{itemId}/quantity',
            params
        );
    }

    public deleteCartItem(params: DeleteCartItemParams): Promise<any> {
        return ApiService.delete(
            '/carts/freeshopping/mine/items/{itemId}',
            params
        );
    }
}

export default new CartService();
