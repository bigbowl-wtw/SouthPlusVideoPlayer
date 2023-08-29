import { AccountService } from './service/account';
import { AuthService } from './service/auth';
import { TweetService } from './service/tweet';
import { UserService } from './service/user';

interface ITwitterAPI {
    account: AccountService;
    user: UserService;
    tweet: TweetService;
}

let api: ITwitterAPI;

export function TwitterAPI(ct0?: string): ITwitterAPI {
    if (!api) {
        const auth = new AuthService(ct0);
        api = {
            account: new AccountService(auth),
            user: new UserService(auth),
            tweet: new TweetService(auth),
        };
    } else if (ct0 && ct0 !== '') {
        api.account.setCSRFToken(ct0);
    }
    return api;
}
