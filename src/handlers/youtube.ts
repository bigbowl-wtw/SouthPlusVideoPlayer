import { insertIFrameElement } from '../utils/utils';
import Handler from './handler';

export default class YouTubeHandler implements Handler {
    regex =
        /(youtu.be\/|youtube.com\/(?:(?:embed|v|shorts)\/|watch\?v=))(?<vid>[\w-]+)/;

    vid?: string;

    test(a: HTMLAnchorElement): boolean {
        this.vid = this.regex.exec(a.href)?.groups!.vid;
        return !!this.vid;
    }

    apply(a: HTMLAnchorElement): void {
        const result = /t|start=(?<t>\d+)s?/.exec(a.href);
        let start: string | undefined;
        if (result) start = result[1];
        const url = new URL(this.vid!, 'https://www.youtube.com/embed/');
        if (start) url.searchParams.set('start', start);
        insertIFrameElement(a, {
            src: url.toString(),
            allowfullscreen: true,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        });
    }
}

Handler.registerHandler(YouTubeHandler);
