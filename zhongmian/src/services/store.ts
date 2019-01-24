import { IStore } from '../interfaces';
import { ApiService } from '../services';

class StoreService {
    private _store: IStore;

    public isInStore(): boolean {
        return this._store ? true : false;
    }

    public async getStoreById(
        code: number
    ): Promise<Taro.request.Promised<IStore>> {
        return ApiService.get<IStore>('/store/{code}', { code });
    }

    public async switchStore(storeId: number): Promise<boolean> {
        try {
            const result = await this.getStoreById(storeId);
            if (result.statusCode !== 200) {
                return false;
            }
            this._store = result.data;
            if (this._store.subsiteiId && this._store.id) {
                //切换门店后，设置通用头信息
                ApiService.customHeader({
                    // 分站ID
                    subsiteId: this._store.subsiteiId,
                    warehouseId: this._store.id
                }); // 仓库ID
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    public getCurrentStore(): IStore {
        return this._store;
    }
}

export default new StoreService();
