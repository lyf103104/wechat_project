import { ApiService, StorageService } from '../services';
import { IUser } from '../interfaces';
import { Environment } from '../tools';

interface SessionAndGetUserInfoParams {
    code: string;
    encryptedData: string;
    iv: string;
    signature: string;
}

interface GetPhoneNumberParams {
    encryptedData: string;
    iv: string;
}

class UserService {
    private _user: IUser | null;

    public init() {
        // 恢复持久状态，如果失效了就清空。
        let user = this.restoreStorage();
        this._user = user;

        if (user) {
            let alived = this.checkSessionAlive();
            if (!alived) {
                this._user = null;
                this.updateStorage();
            }
        }
    }

    /**
     * 从APP同步登录状态
     *
     * 注意:这个状态不需要持久化，每次运行都会重新同步
     */
    public syncUserWithAPP(user): void {
        this._user = user;
    }

    public async isLogin(): Promise<boolean> {
        if (!this.hasSession()) {
            return false;
        } else {
            return this.checkSessionAlive();
        }
    }

    public isBindMobile(): boolean {
        if (this._user && this._user.id > 0) {
            return true;
        } else {
            return false;
        }
    }

    public async loginByUnionId(
        params: SessionAndGetUserInfoParams
    ): Promise<boolean> {
        try {
            const result = await ApiService.post<IUser>(
                '/members/freeshopping/login',
                params
            );

            if (result.statusCode !== 201) {
                return false;
            }
            this._user = result.data;
            this.updateStorage();

            return true;
        } catch (error) {
            return false;
        }
    }

    public async loginByUnionIdAndPhone(
        params: GetPhoneNumberParams
    ): Promise<boolean> {
        try {
            const result = await ApiService.post<IUser>(
                '/members/freeshopping/login/mobile',
                params
            );
            if (result.statusCode !== 201) {
                return false;
            }
            this._user = result.data;
            this.updateStorage();
            return true;
        } catch (error) {
            return false;
        }
    }

    public getCurrentUser() {
        return this._user;
    }

    private restoreStorage(): IUser {
        return StorageService.readSync('user');
    }

    private updateStorage(user = this._user): void {
        return StorageService.writeSync('user', user);
    }

    private hasSession(): boolean {
        return this._user ? true : false;
    }

    private async checkSessionAlive(): Promise<boolean> {
        try {
            // 小程序环境下默认session永不过期
            if (Environment.isWeb) {
                return true;
            }
            const result = await ApiService.get(
                '/members/freeshopping/checksession'
            );
            if (result.statusCode === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}

export default new UserService();
