export interface IOperation {
    queryId: string;
    operationName: string;
    operationType: string;
    metadata: {
        featureSwitches: string[];
        fieldToggles: string[];
    };
    features: {
        [K in IOperation['metadata']['featureSwitches'][number]]: boolean;
    };
}

export interface IEndpoint {
    [name: string]: IOperation;
}
