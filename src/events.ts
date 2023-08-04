/* eslint-disable @typescript-eslint/no-unused-vars */

export enum Events {
    SHOW_UPDATE_INFORMATION = 'show-update-infromation',

    TWITTER_VERIFY = 'twitter-vertify',
    TWITTWR_INVALIDATE = 'twitter-invalidate',
    TWITTER_REAUTHORIZE = 'twitter-reauthorize',

    MENU_REGISTER_AUTHORIZATION = 'menu-register-authorization',
    MENU_REGISTER_CLEARCACHE = 'menu-register-clearcache',

    VIEW_SHOW_TWITTER_CT0 = 'view-show-twitter-ct0',
    VIEW_SHOW_TWITTER_LOGGEDIN = 'view-show-twitter-loggedin',
    VIEW_SHOW_TWITTER_GUEST = 'view-show-twitter-guest',

    VIEW_CLOSE_DIALOG = 'view-close-dialog',
}

export interface Listeners {
    [Events.SHOW_UPDATE_INFORMATION]: (
        event: Events.SHOW_UPDATE_INFORMATION
    ) => void;

    [Events.TWITTER_VERIFY]: (event: Events.TWITTER_VERIFY) => void;

    [Events.TWITTWR_INVALIDATE]: (event: Events.TWITTWR_INVALIDATE) => void;

    [Events.TWITTER_REAUTHORIZE]: (event: Events.TWITTER_REAUTHORIZE) => void;

    [Events.MENU_REGISTER_AUTHORIZATION]: (
        event: Events.MENU_REGISTER_AUTHORIZATION
    ) => void;

    [Events.VIEW_SHOW_TWITTER_CT0]: (
        event: Events.VIEW_SHOW_TWITTER_LOGGEDIN
    ) => void;
    [Events.VIEW_SHOW_TWITTER_LOGGEDIN]: (
        event: Events.VIEW_SHOW_TWITTER_LOGGEDIN
    ) => void;
    [Events.VIEW_SHOW_TWITTER_GUEST]: (
        event: Events.VIEW_SHOW_TWITTER_GUEST
    ) => void;

    [Events.VIEW_CLOSE_DIALOG]: (
        event: Events.VIEW_CLOSE_DIALOG,
        thisElement: JQuery.Selector | HTMLElement | JQuery<HTMLElement>
    ) => void;

    // [Events.VIEW_SHOW_CLEARCACHE_SUCCESS]: () => void;
    // [Events.VIEW_HIDE_CLEARCACHE_SUCCESS]: () => void;
}

// type Intersection = Exclude<Events, keyof Listeners>;

// type ListenersKeyCheck = Intersection extends never ? any : never;

// // 该行报错表示 Listeners 中缺少 Events 中的项，须在 Listeners 中补全
// // 缺少的项由 Intersection 列出
// interface Never extends ListenersKeyCheck {}

export type ExcludeFirst<T extends any[]> = T extends [infer _, ...infer R]
    ? R
    : never;

/**
 * EventEmitter based on jQuery event
 */
export class EventEmitter<T extends Element | Document> {
    private emitter: JQuery<T>;

    constructor(element: T = document as T) {
        this.emitter = $<T>(element);
    }

    on<E extends keyof Listeners, Context = undefined>(
        event: E,
        listener: Listeners[E],
        context: Context = this as any
    ) {
        this.emitter.on(event, listener.bind(context));
    }

    once<E extends keyof Listeners, Context = undefined>(
        event: E,
        listener: Listeners[E],
        context: Context = this as any
    ) {
        this.emitter.one(event, listener.bind(context));
    }

    /**
     * 如果传入 `listener`，将移除所有已绑定的事件，然后绑定 `listener`
     */
    off<E extends keyof Listeners, Context = undefined>(
        event: E,
        listener?: Listeners[E],
        context: Context = this as any
    ) {
        if (!listener) this.emitter.off(event);
        else this.emitter.off(event, '**', listener.bind(context));
    }

    trigger<E extends keyof Listeners>(
        event: E,
        ...datas: ExcludeFirst<Parameters<Listeners[E]>>
    ) {
        this.emitter.trigger(event, ...datas);
    }
}

let emitter: EventEmitter<Document>;

export function defaultEventEmitter() {
    if (!emitter) emitter = new EventEmitter();
    return emitter;
}
