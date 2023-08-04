// eslint-disable-next-line import/no-extraneous-dependencies
import requests from 'gm-requests';

import cache from '../managers/cache';
import { insertIFrameElement } from '../utils/utils';
import Handler from './handler';

export default class BilibiliHandler implements Handler {
    regex = /b23.tv|(?<bvid>BV[a-lm-zA-HJ-NP-Z1-9]{10})/;
    bvid?: string;

    test(a: HTMLAnchorElement): boolean {
        const result = this.regex.exec(a.href);
        if (result) this.bvid = result[1];
        return !!result;
    }

    async apply(a: HTMLAnchorElement): Promise<void> {
        let url = a.href;
        if (!this.bvid) {
            // b23.tv
            const cached = cache.get(url) as string;
            if (!cached) {
                await this.parseShortURL(url);
                this.apply(a);
                return;
            }
            console.log('cached:', url);
            url = cached;
            this.bvid = this.regex.exec(url)![1];
        }
        const result = /p=(?<pid>\d+)/.exec(url);
        const pid: number = result ? parseInt(result.groups!.pid, 10) : 1;
        const cachedInfo = cache.get(this.bvid);
        let aid: number;
        let cid: number;
        if (cachedInfo) {
            console.log('cached', a.href);
            ({ aid, cid } = cachedInfo);
            this.insertIframe(a, aid, cid, pid);
            return;
        }
        const ret = await requests.get<{ data: any }>(
            'https://api.bilibili.com/x/web-interface/view',
            { bvid: this.bvid },
            { responseType: 'json' }
        );
        aid = ret.data.aid;
        cid = ret.data.pages[pid - 1].cid;
        cache.set(ret.data.bvid, { aid, cid });
        this.insertIframe(a, aid, cid, pid);
    }

    async parseShortURL(url: string) {
        const resp = await requests.get(url, null, { anonymous: true });
        cache.set(url, resp.finalUrl);
        const result = this.regex.exec(resp.finalUrl);
        if (result) this.bvid = result[1];
    }

    insertIframe(a: HTMLAnchorElement, aid: number, cid: number, pid: number) {
        insertIFrameElement(a, {
            src: `https://player.bilibili.com/player.html?aid=${aid}&bvid=${this.bvid}&cid=${cid}&page=${pid}&as_wide=1&high_quality=1&danmaku=0&autoplay=0`,
            frameborder: 'no',
            scrolling: 'no',
            allowfullscreen: true,
        });
    }
}

Handler.registerHandler(BilibiliHandler);
