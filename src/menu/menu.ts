import { defaultEventEmitter, Events } from '../events';
import cache from '../managers/cache';
import config from '../managers/config';

const emitter = defaultEventEmitter();

let GM_authorization_menu_id: number | undefined;
const menu = {
    authorization() {
        function isAuthorized() {
            return config && config.user_info !== undefined && config.ct0;
        }

        if (GM_authorization_menu_id !== undefined) {
            GM_unregisterMenuCommand(GM_authorization_menu_id);
        }

        if (isAuthorized()) {
            GM_authorization_menu_id = GM_registerMenuCommand(
                `✔️登录用户：${config.user_info.fullName} (@${config.user_info.userName})`,
                () => emitter.trigger(Events.VIEW_SHOW_TWITTER_LOGGEDIN)
            );
        } else if (!config?.ct0) {
            GM_authorization_menu_id = GM_registerMenuCommand(
                `⭕点击输入 ct0`,
                () => emitter.trigger(Events.VIEW_SHOW_TWITTER_CT0)
            );
        } else {
            GM_authorization_menu_id = GM_registerMenuCommand(
                `❌未登录，点击登录`,
                () => emitter.trigger(Events.VIEW_SHOW_TWITTER_GUEST)
            );
        }
    },

    clearCache() {
        GM_registerMenuCommand('清除脚本缓存（解决莫名其妙的加载问题）', () => {
            cache.clear();
            const $success = $(
                `<div class="gm-dialog"><div class="success-box gm-dialog"><p>操作成功！</p></div></div>`
            );
            $success.hide().appendTo(document.body).fadeIn(200);
            setTimeout(() => $success.fadeOut(() => $success.remove()), 1400);
        });
    },

    reportIssue() {
        GM_registerMenuCommand('报告问题', () => {
            GM_openInTab(
                'https://github.com/bigbowl-wtw/SouthPlusVideoPlayer/issues',
                true
            );
        });
    },
};

emitter.on(Events.MENU_REGISTER_AUTHORIZATION, menu.authorization);

export default function registerMenuCommand() {
    for (const register of Object.values(menu)) register();
}
