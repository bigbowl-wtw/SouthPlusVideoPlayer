import { Events, defaultEventEmitter } from '../events';
import { TwitterAPI } from '../libs/twitter';
import { IMedia } from '../libs/twitter/types/tweet';
import config from '../managers/config';
import { insertHlsPlayer, insertVideoElement } from '../utils/utils';
import Handler from './handler';

const PREFER_STREAM_MIN_DURATION = 5 * 60 * 1000; // ms

type Url = string;

class TweetVideo {
    src: Url;

    poster?: Url;

    durationMs: number = 0;

    isStream: boolean;

    fallback: string;

    constructor(media: IMedia) {
        this.poster = media.poster;
        this.durationMs = media.durationMs;
        this.isStream = this.durationMs > PREFER_STREAM_MIN_DURATION;
        this.src = this.isStream ? media.stream : media.fallback;
        this.fallback = media.fallback;
    }

    dump(): { src: Url; poster?: Url; fallback?: Url } {
        const data: any = { src: this.src };
        if (this.poster) data.poster = this.poster;
        if (this.isStream) data.fallback = this.fallback;
        return data;
    }
}

export default class TwitterHandler implements Handler {
    regex = /video.twimg.com|twitter.com\/.*\/status\/(?<id>\d+)/;

    id?: string | undefined;

    twitter = TwitterAPI(config.ct0);

    test(a: HTMLAnchorElement): boolean {
        const result = this.regex.exec(a.href);
        if (result) this.id = result.groups!.id;
        return !!result;
    }

    async apply(a: HTMLAnchorElement): Promise<void> {
        if (this.id === undefined) {
            // twimg.com
            insertVideoElement(a, a.href);
            return;
        }
        if (!this.checkCT0()) {
            defaultEventEmitter().trigger(Events.VIEW_SHOW_TWITTER_GUEST);
            return;
        }
        const tweet = await this.twitter.tweet
            .getTweetDetail(this.id)
            .catch(e => console.error(e));
        if (!tweet) return;

        tweet.extendedEntities.media
            .map(media => new TweetVideo(media))
            .forEach(video => {
                const attrs = video.dump();
                if (video.isStream) insertHlsPlayer(a, attrs);
                else insertVideoElement(a, attrs);
            });
    }

    // eslint-disable-next-line class-methods-use-this
    checkCT0() {
        return !!(config.as_guest || config.ct0);
    }
}

Handler.registerHandler(TwitterHandler);
