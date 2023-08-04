/* eslint-disable func-names */
// eslint-disable-next-line import/no-extraneous-dependencies
import Hls from 'hls.js';

import htmlIFrame from '../view/iframe.html';
import htmlVideo from '../view/video.html';

/**
 * 防抖
 * @param fn 回调
 * @param timeout 间隔
 */
export function debounce(fn: Function, timeout: number) {
    let timer: number;
    return function (...rest) {
        window.clearTimeout(timer);
        timer = window.setTimeout(fn.bind(this, ...rest), timeout);
    };
}

export const dump = debounce(function () {
    GM.setValue(this.name, this.dataSet);
}, 200);

interface Attributes {
    src: string;
    poster?: string;
    fallback?: string;
    [key: string]: string | undefined | any;
}

export function insertVideoElement(
    a: HTMLAnchorElement,
    attrs: Attributes | string
): { video: HTMLVideoElement; attrs: Attributes } {
    if (typeof attrs === 'string' /* 直接传入 URL */) {
        const src = attrs;
        attrs = { src };
    }
    const $htmlText = $<HTMLDivElement>(htmlVideo);
    const $video = $<HTMLVideoElement>('video', $htmlText);
    $video.attr(attrs);
    $htmlText.insertBefore(a);
    const video = $video[0];
    return { video, attrs };
}

export function insertHlsPlayer(
    a: HTMLAnchorElement,
    attributes: Attributes | string
): void {
    const { video, attrs } = insertVideoElement(a, attributes);
    // apple 平台原生支持 hls，无需处理
    if (!/Mac|iPod|iPhone|iPad/.test(navigator.userAgent)) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(attrs.src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                data.levels.sort((x, y) => y.bitrate - x.bitrate);
                hls.currentLevel = 0;
            });
        } else {
            console.log('Hls不支持当前浏览器');
            if (attrs.fallback) video.src = attrs.fallback;
        }
    }
}

async function bindVolumeSync() {
    let volume: number = await GM.getValue(Key.VOLUME, 1);
    $<HTMLVideoElement>('video.volume-sync')
        .on('volume-sync', function (_, volume_: number) {
            this.volume = volume_;
        })
        .on('mouseover', function () {
            $(this).on(
                'volumechange',
                debounce(function () {
                    volume = this.volume;
                    GM.setValue(Key.VOLUME, volume);
                    $('video.volume-sync')
                        .not(this)
                        .trigger('volume-sync', volume);
                }, 200)
            );
        })
        .on('mouseout', function () {
            $(this).off('volumechange');
        });
}

// $.on 对未来的元素有效，因此直接执行即可
bindVolumeSync();

const observer = new IntersectionObserver(
    entries => {
        entries
            .filter(entry => entry.isIntersecting)
            .forEach(entry => {
                console.log('lazyload');
                const e = entry.target as HTMLIFrameElement;
                e.src = e.dataset.src!;
                e.classList.replace('lazy', 'loaded');
                observer.unobserve(e);
            });
    },
    {
        rootMargin: '0px 0px 640px',
    }
);

export function insertIFrameElement(
    a: HTMLAnchorElement,
    attributes: Attributes
) {
    const { src, ...attrs } = attributes;
    attrs['data-src'] = src;
    const $div = $(htmlIFrame);
    const iframe = $<HTMLIFrameElement>('iframe', $div).attr(attrs)[0];
    observer.observe(iframe);
    $div.insertBefore(a);
}

function toNumber(version: string): number[] {
    const versionMap = { alpha: '-2', beta: '-1' };
    const testVersionReg = /alpha|beta/;
    return version
        .split('.')
        .map(x => (testVersionReg.test(x) ? versionMap[x] : x))
        .map(x => parseInt(x, 10));
}

function shiftDefault<T = unknown>(array: T[], default_: T): T {
    const val = array.shift();
    if (val === undefined) return default_;
    return val;
}

function laterThan(newer: string, local: string): boolean {
    const v1 = toNumber(newer);
    const v2 = toNumber(local);
    let a: number;
    let b: number;
    while (v1.length || v2.length) {
        a = shiftDefault(v1, 0);
        b = shiftDefault(v2, 0);
        if (a > b) return true;
    }
    return false;
}

export function isUpdated(callback: () => void) {
    GM.getValue<string>(Key.VERSION, '0.0.0').then(localVersion => {
        if (laterThan(GM_info.script.version, localVersion)) {
            callback();
            GM.setValue(Key.VERSION, GM_info.script.version);
        }
    });
}
