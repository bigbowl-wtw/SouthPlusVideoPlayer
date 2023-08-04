import { registerControllers } from './controllers/inedx';
import { defaultEventEmitter, Events } from './events';
import Handler from './handlers';
import cache from './managers/cache';
import config from './managers/config';
import registerMenuCommand from './menu/menu';
import { isUpdated } from './utils/utils';
import initViews from './view';

const NOTIFY = true;

isUpdated(() => {
    if (NOTIFY) defaultEventEmitter().trigger(Events.SHOW_UPDATE_INFORMATION);

    // v5.0.0: 更新了 twitter api，采用新的授权方式，清除旧数据
    delete config.user_info;
    delete config.access_token;
    cache.clear();

    // v5.0.0: 检测是否登录
    defaultEventEmitter().trigger(Events.VIEW_SHOW_TWITTER_GUEST);
});

registerMenuCommand();

initViews();

registerControllers();

Handler.process();
