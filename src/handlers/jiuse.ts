// eslint-disable-next-line import/no-extraneous-dependencies
import requests from 'gm-requests';

import cache from '../managers/cache';
import { insertHlsPlayer } from '../utils/utils';
import Handler from './handler';

const MAX_EXPIRE_SECOND = 5 * 24 * 3600;

class HlsParser {
    private baseUrl: string;

    private hlsString: string;

    async parse(url: string) {
        this.baseUrl = url.substring(0, url.lastIndexOf('/'));
        const ret = await requests.get(url, null, { anonymous: true });
        this.hlsString = ret.response;
        this.addBaseUrl();
        return this.hlsString;
    }

    addBaseUrl() {
        this.hlsString = this.hlsString.replace(
            /^(?!#)(\S+)/gm,
            `${this.baseUrl}/$1`
        );
    }
}

export default class JiuseHandler implements Handler {
    regex = /(?:91porny|jiuse|9s\d{3}.xyz|js(?:tv\d?|\d{3}).cc).+\/(\w+)/;

    parser = new HlsParser();

    id?: string;
    key: string;

    test(a: HTMLAnchorElement): boolean {
        const result = this.regex.exec(a.href);
        if (result) this.id = result[1];
        return !!result;
    }

    async apply(a: HTMLAnchorElement) {
        let attrs = this.getCacheData();
        if (!attrs) {
            attrs = await this.getAttrs();
        }
        insertHlsPlayer(a, attrs);
    }

    getCacheData() {
        this.key = `jiuse-${this.id}`;
        const cachedInfo: { hlsString: string; poster: string } | undefined =
            cache.get(this.key);
        if (cachedInfo) {
            console.log('cached:', this.key);
            return {
                src: JiuseHandler.createLevelFileURL(
                    window.atob(cachedInfo.hlsString)
                ),
                poster: cachedInfo.poster,
            };
        }
        return undefined;
    }

    async getAttrs() {
        const resp = await requests.get(
            `https://91porny.com/video/embed/${this.id}`
        );
        const $video = $(
            resp.responseText,
            document.implementation.createHTMLDocument('virtual')
        ).filter('#video-play');
        const url = $video.data('src');
        const poster = $video.data('poster');
        const expireAt = Math.floor(Date.now() / 1000 + MAX_EXPIRE_SECOND);

        const hlsString = await this.parser.parse(url);

        cache.set(
            this.key,
            { hlsString: window.btoa(hlsString), poster },
            expireAt
        );

        return {
            src: JiuseHandler.createLevelFileURL(hlsString),
            poster,
        };
    }

    static createLevelFileURL(hlsString: string) {
        return URL.createObjectURL(
            new File([hlsString], 'index.m3u8', {
                type: 'text/plain',
            })
        );
    }
}

Handler.registerHandler(JiuseHandler);
