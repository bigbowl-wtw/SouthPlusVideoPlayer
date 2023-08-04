// eslint-disable-next-line @typescript-eslint/no-unused-vars
import requests from 'gm-requests';
import { IAuth, IHeader } from 'gm-requests/src/types';

import cache from '../../../managers/cache';
import { config } from '../config';

export class AuthService implements IAuth {
    public isAuthenticated: boolean;

    private authenticate: boolean = true;
    private authToken: string;
    private csrfToken?: string;

    // eslint-disable-next-line class-methods-use-this
    private get guestTokne(): string {
        return cache.get(Key.GUEST_TOKEN);
    }

    // eslint-disable-next-line class-methods-use-this
    private set guestTokne(token: string) {
        cache.set(Key.GUEST_TOKEN, token, 10800);
    }

    constructor(ct0?: string) {
        this.authToken = config.twitter_auth_token;
        this.setCSRFToken(ct0);
    }

    setAuthenticate(authenticate: boolean): this {
        this.authenticate = authenticate;
        return this;
    }

    setCSRFToken(ct0: string | undefined) {
        this.csrfToken = ct0;
        this.isAuthenticated = !!ct0;
    }

    async refresh() {
        const { guest_token } = await requests.post<{ guest_token: string }>(
            config.guest_token_url,
            {
                headers: {
                    Authorization: this.authToken,
                },
                responseType: 'json',
            }
        );
        this.guestTokne = guest_token;
    }

    async build(header: IHeader) {
        // 已经登录，cookie 由浏览器管理
        if (this.authenticate && this.isAuthenticated) {
            header.update({
                Authorization: this.authToken,
                'x-csrf-token': this.csrfToken,
                'x-twitter-auth-type': 'OAuth2Session',
                'x-twitter-active-user': 'yes',
                'x-twitter-client-language': 'zh-cn',
            });
        } else {
            if (!this.guestTokne) {
                await this.refresh();
            }
            header.update({
                Authorization: this.authToken,
                'x-guest-token': this.guestTokne,
            });
        }
    }
}
