import config from '../../../managers/config';
import { UserFromInitialState } from '../models/data/user';
import { InitialState } from '../types/InitialState';
import { AuthService } from './auth';
import * as fetch from './fetch';

export class UserService {
    auth: AuthService;
    constructor(auth: AuthService) {
        this.auth = auth;
    }

    private http = fetch;

    async getSelf() {
        if (config.user_info) return config.user_info;
        const url = 'https://twitter.com/home';
        const html = await this.http.requests
            .get(url)
            .then(resp => (resp.finalUrl === url ? resp.responseText : null));
        if (!html) return null;
        const result =
            /window.__INITIAL_STATE__=(.*);window.__META_DATA__/.exec(html);
        if (!result) return null;
        const initialState: InitialState = JSON.parse(result[1]);

        const user = new UserFromInitialState(initialState);

        config.user_info = user;

        return user;
    }
}
