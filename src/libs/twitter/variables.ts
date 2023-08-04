import { IOperation } from './types/endpoints';

// eslint-disable-next-line no-underscore-dangle
const _Variables = {
    TweetDetail: {
        with_rux_injections: false,
        includePromotedContent: true,
        withCommunity: true,
        withQuickPromoteEligibilityTweetFields: true,
        withBirdwatchNotes: true,
        withVoice: true,
        withV2Timeline: true,
    },
};

class Variables {
    private variables: object;
    constructor(endpoint: IOperation, query?: { [key: string]: string }) {
        this.variables = {
            ...(query ?? {}),
            ..._Variables[endpoint.operationName],
        };
    }

    toString(): string {
        return JSON.stringify(this.variables);
    }
}

export default Variables;
