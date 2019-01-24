export default interface IUser {
    id: number;
    loginName: string;
    userSession: string;
    hasPayPassword: string;
    oldId: number;
    oldUserSessionId: string;
    eopMemberBindStatus: number;
}
