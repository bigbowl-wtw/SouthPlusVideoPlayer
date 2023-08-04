import Manager from './manager';

interface AccessToken {
    oauth_token: string;
    oauth_token_secret: string;
    user_id: string;
    screen_name: string;
}

class Config extends Manager {
    access_token?: AccessToken;
    user_info?;
    as_guest?;
    ct0?;

    constructor() {
        super(Key.CONFIG);
    }

    get(key: string) {
        return this.dataSet[key];
    }

    set(key: string, value: any) {
        this.dataSet[key] = value;
        this.dump();
    }

    delete(key: string) {
        delete this.dataSet[key];
        this.dump();
    }
}

const config = new Proxy(new Config(), {
    get(target, prop: string) {
        return target.get(prop);
    },
    set(target, prop, value) {
        target.set(prop as string, value);
        return true;
    },
    deleteProperty(target, property) {
        target.delete(property as string);
        return true;
    },
});

export default config;
