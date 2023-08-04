import { IArgs } from './types/args';
import { IOperation } from './types/endpoints';
import Variables from './variables';

export class Url {
    private baseUrl: string = 'https://twitter.com/i/api/graphql';
    url: URL;
    constructor(endpoint: IOperation, args: IArgs) {
        const url = new URL(
            `${this.baseUrl}/${endpoint.queryId}/${endpoint.operationName}`
        );
        url.searchParams.set(
            'variables',
            new Variables(endpoint, { focalTweetId: args.id }).toString()
        );
        url.searchParams.set('features', JSON.stringify(endpoint.features));
        if (endpoint.metadata?.fieldToggles.length > 0)
            url.searchParams.set(
                'fieldToggles',
                JSON.stringify(
                    Object.fromEntries(
                        endpoint.metadata?.fieldToggles.map(key => [key, false])
                    )
                )
            );
        this.url = url;
    }

    toString(): string {
        return this.url.toString();
    }
}
