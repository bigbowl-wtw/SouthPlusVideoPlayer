/* eslint-disable import/prefer-default-export */
import {
    Events,
    ExcludeFirst,
    Listeners,
    defaultEventEmitter,
} from '../events';
import { TwitterAPI } from '../libs/twitter';
import { IError } from '../libs/twitter/types/error';
import config from '../managers/config';

const emitter = defaultEventEmitter();

const TWITTER_LOGIN_URL = 'https://twitter.com/login';

abstract class TwitterDialog {
    $dialog: JQuery<HTMLElement>;
    abstract registerListeners(): void;

    constructor() {
        this.registerListeners();
    }

    // eslint-disable-next-line class-methods-use-this
    trigger<E extends keyof Listeners>(
        event: E,
        ...datas: ExcludeFirst<Parameters<Listeners[E]>>
    ) {
        return () => emitter.trigger(event, ...datas);
    }
}

export class TwitterCT0Dialog extends TwitterDialog {
    twitter = TwitterAPI();

    registerListeners(): void {
        emitter.on(Events.VIEW_SHOW_TWITTER_CT0, this.initView, this);
        emitter.on(Events.TWITTER_VERIFY, this.verify, this);
    }

    verify() {
        $('#loading-overlay', this.$dialog).fadeIn(200);
        const ct0 = $('#pin').val() as string;
        if (!ct0) return;
        config.as_guest = false;
        config.ct0 = ct0;
        this.twitter.account.setCSRFToken(ct0);
        this.twitter.account
            .getSelf()
            .then(ret => {
                if (!isError(ret)) {
                    emitter.trigger(Events.VIEW_SHOW_TWITTER_LOGGEDIN);
                    emitter.trigger(Events.MENU_REGISTER_AUTHORIZATION);
                    $('.gm-btn-close', this.$dialog).trigger('click');
                    return;
                }
                $('#error-msg', this.$dialog).text((ret as any).reason);
                $('.gm-toggle', this.$dialog).fadeOut(() =>
                    $('.error', this.$dialog).fadeIn()
                );
                this.twitter.account.setCSRFToken('');
                config.ct0 = undefined;
            })
            .finally(() => $('#loading-overlay', this.$dialog).fadeOut());
    }

    private initView() {
        this.$dialog = $('#twitter-ct0').fadeIn(200);
        $('#gm-verify-btn', this.$dialog).on(
            'click',
            this.trigger(Events.TWITTER_VERIFY)
        );
    }
}

export class TwitterLoggedInDialog extends TwitterDialog {
    registerListeners() {
        emitter.on(Events.VIEW_SHOW_TWITTER_LOGGEDIN, this.initView, this);
    }

    private initView() {
        this.$dialog = $('#twitter-logged-in').fadeIn(200);
        if (!config.user_info) {
            $('#loading-overlay', this.$dialog).fadeIn(200);
            TwitterAPI()
                .account.getSelf()
                .then(ret => {
                    if (isError(ret)) return;
                    this.setUserInfo(ret);
                })
                .finally(() => $('#loading-overlay', this.$dialog).fadeOut());
        }
        this.setUserInfo(config.user_info);
    }

    private setUserInfo(user: {
        profileImage: string;
        fullName: string;
        userName: string;
    }) {
        $('#user-avatar', this.$dialog).attr('src', user.profileImage);
        $('#user-name', this.$dialog).text(user.fullName);
        $('#user-id', this.$dialog).text(`@${user.userName}`);
    }
}

export class TwitterGuestDialog extends TwitterDialog {
    registerListeners() {
        emitter.on(Events.VIEW_SHOW_TWITTER_GUEST, this.initView, this);
    }

    initView() {
        this.$dialog = $('#twitter-guest').fadeIn(200);
        config.as_guest = true;

        $('.gm-btn-login', this.$dialog).on('click', () => {
            GM_openInTab(TWITTER_LOGIN_URL, false);
            this.showCT0View();
        });

        $('.gm-btn-logged', this.$dialog).on('click', () => {
            this.showCT0View();
        });
    }

    showCT0View() {
        config.as_guest = false;
        this.$dialog.fadeOut(this.trigger(Events.VIEW_SHOW_TWITTER_CT0));
    }
}

emitter.on(Events.TWITTER_REAUTHORIZE, () => {
    // eslint-disable-next-line no-alert
    alert('Twitter 授权错误或过期，请重新授权！');
    delete config.access_token;
    emitter.trigger(Events.VIEW_SHOW_TWITTER_GUEST);
    emitter.trigger(Events.MENU_REGISTER_AUTHORIZATION);
});

function isError(obj: any): obj is IError {
    return obj.error !== undefined;
}
