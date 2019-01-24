/**
 * 假数据
 * @param result 返回值
 * @param delaySec 延迟
 * @example return FakeResult<IStore>({name: "测试门店" + storeId, id: storeId});
 */

function FakeResult<T>(result: T, delaySec: number = 1): Promise<T> {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve(result);
        }, delaySec * 1000);
    });
}
export default FakeResult;
