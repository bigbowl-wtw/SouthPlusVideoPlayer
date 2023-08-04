// eslint-disable-next-line import/no-extraneous-dependencies
import requests from 'gm-requests';

import { Url } from '../url';
import { AuthService } from './auth';

interface Options {
    /** default true */
    authenticate?: boolean;

    /** default true */
    json?: boolean;

    data?: any;

    dataJSON?: any;
}

export class FetchService {
    requests = requests;
    auth: AuthService;

    constructor(auth: AuthService) {
        if (auth) this.auth = auth;
    }

    get<T>(url: Url, options?: Options) {
        return this.request<T>('GET', url, options);
    }

    post<T>(url: Url, options?: Options) {
        return this.request<T>('POST', url, options);
    }

    // eslint-disable-next-line class-methods-use-this
    refreshAuth() {
        this.auth.refresh();
    }

    // eslint-disable-next-line class-methods-use-this
    async request<T, TContext = object>(
        method: 'GET' | 'POST',
        url: Url,
        options: Options = {}
    ) {
        const opt: any = {};
        if (options.json !== false) opt.responseType = 'json';
        opt.data = options.data;
        opt.json = options.dataJSON;
        if (options.authenticate !== undefined)
            this.auth.setAuthenticate(options.authenticate);
        opt.auth = this.auth;
        opt.headers = { 'Content-Type': 'application/json' };
        return requests
            .session<TContext>()
            .request<T>(method, url.toString(), opt);
    }
}

export { requests };
