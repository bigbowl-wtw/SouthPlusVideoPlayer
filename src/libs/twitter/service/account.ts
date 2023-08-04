import config from '../../../managers/config';
import { UserFromInitialState } from '../models/data/user';
import { InitialState } from '../types/InitialState';
import { IError } from '../types/error';
import { IUser } from '../types/user';
import { AuthService } from './auth';
import { FetchService } from './fetch';

export class AccountService {
    private http: FetchService;
    constructor(auth: AuthService) {
        this.http = new FetchService(auth);
    }

    async verifyLogin(): Promise<boolean> {
        const result = await this.getSelf();
        return typeof result !== 'string';
    }

    async getSelf(): Promise<IUser | IError> {
        if (config.user_info) return config.user_info;
        const url = 'https://twitter.com/home';
        const html = await this.http.requests
            .get(url)
            .then(resp => (resp.finalUrl === url ? resp.responseText : null));
        if (!html) {
            console.error(
                'TwitterAPI.account.getSelf',
                'can not get response text'
            );
            return { error: true, reason: 'can not get response text' };
        }
        const result =
            /window.__INITIAL_STATE__=(.*);window.__META_DATA__/.exec(html);
        if (!result) {
            console.error(
                'TwitterAPI.account.getSelf',
                'no __INITIAL_STATE__ find'
            );
            return { error: true, reason: 'no __INITIAL_STATE__ find' };
        }
        const initialState: InitialState = JSON.parse(result[1]);

        const user = new UserFromInitialState(initialState);

        config.user_info = user;

        return user;
    }

    refreshAuth() {
        this.http.refreshAuth();
    }

    // eslint-disable-next-line class-methods-use-this
    setCSRFToken(ct0: string) {
        this.http.auth.setCSRFToken(ct0);
    }
}
