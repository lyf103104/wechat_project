interface requestOption {
    service?: string;
    header: object;
    dataType?: 'json';
}

interface responseData<T> {
    statusCode: number;
    errorMessage?: string;
    data?: T;
}

interface responsePages<T> {
    items: [T];
    page: number;
    total: number;
}

export { requestOption, responseData, responsePages };
