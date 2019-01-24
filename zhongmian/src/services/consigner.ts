import { ApiService } from '.';
import { IConsignerListConsigner, ICheckoutConsigner } from '../interfaces';

interface SaveConsignerParams {
    id?: number;
    recipients: string;
    phone: string;
    credentialsType: number;
    cardNo: string;
    countryId: number;
    isDefault?: boolean;
}

interface ConsigneeListResponse {
    message: string;
    valid_address_list: Array<IConsignerListConsigner>;
}

class ConsignerService {
    public transformICheckoutConsignerToIConsignerListConsigner(
        params: ICheckoutConsigner
    ): IConsignerListConsigner {
        return {
            countryId: params.countryId,
            countryStr: params.countryStr,
            credentialsType: params.credentialsType,
            credentialsTypeStr: params.credentialsTypeStr,
            id: params.id,
            name: params.name,
            idCardNo: params.cardNo,
            checked: false,
            isdefault: 0,
            isClose: false,
            mobilephone: params.mobile
        };
    }

    public transformIConsignerListConsignerToICheckoutConsigner(
        params: IConsignerListConsigner
    ): ICheckoutConsigner {
        return {
            countryId: params.countryId,
            countryStr: params.countryStr,
            credentialsType: params.credentialsType,
            credentialsTypeStr: params.credentialsTypeStr,
            id: params.id,
            name: params.name,
            cardNo: params.idCardNo,
            mobile: params.mobilephone
        };
    }

    public getConsignees(): Promise<
        Taro.request.Promised<ConsigneeListResponse>
    > {
        return ApiService.get<ConsigneeListResponse>('/consignees/mine');
    }

    public saveConsigner(
        params: SaveConsignerParams
    ): Promise<Taro.request.Promised<any>> {
        return ApiService.post('/consignees', params);
    }

    public editConsigner(
        params: SaveConsignerParams
    ): Promise<Taro.request.Promised<any>> {
        return ApiService.put('/consignees/{id}', params);
    }

    public setConsignerDefault(
        id: number
    ): Promise<Taro.request.Promised<any>> {
        return ApiService.put('/consignees/{id}/default', { id });
    }

    public deleteConsigner(id: number): Promise<Taro.request.Promised<any>> {
        return ApiService.delete('/consignees/{id}', { id });
    }
}

export default new ConsignerService();
