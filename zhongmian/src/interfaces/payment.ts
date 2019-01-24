export interface IPayment {
    appId: string,
    timeStamp: string,
    signType: string,
    package: string,
    nonceStr: string,
    paySign: string
}