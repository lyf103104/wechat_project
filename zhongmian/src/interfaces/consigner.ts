interface IConsigner {
    countryId: number;
    countryStr: string;
    credentialsType: number;
    credentialsTypeStr: string;
    id: number;
    name: string;
}

interface ICheckoutConsigner extends IConsigner {
    cardNo: string;
    mobile: string;
}

interface IConsignerListConsigner extends IConsigner {
    checked: boolean;
    idCardNo: string;
    isdefault: number;
    isClose: boolean;
    mobilephone: string;
}

export { ICheckoutConsigner, IConsignerListConsigner, IConsigner };
