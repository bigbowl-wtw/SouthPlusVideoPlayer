import { insertVideoElement } from '../utils/utils';
import Handler from './handler';

export default class BrowserSupportedHandler implements Handler {
    regex = /(mp4|mov)$/i;

    test(a: HTMLAnchorElement): boolean {
        return this.regex.test(a.href);
    }

    // eslint-disable-next-line class-methods-use-this
    apply(a: HTMLAnchorElement): void {
        insertVideoElement(a, { src: a.href });
    }
}

Handler.registerHandler(BrowserSupportedHandler);
