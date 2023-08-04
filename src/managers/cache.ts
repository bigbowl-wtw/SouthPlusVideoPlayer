import Manager from './manager';

const MAXTTL = 7 * 24 * 3600;

interface DataSet {
    [key: string]: Data;
}

class Data {
    value: any;
    lastActive: number;
    ttl: number;
    refresh: boolean;

    constructor(value: any, ttl: number, timestamp: boolean = false) {
        this.value = value;
        const now = Math.floor(Date.now() / 1000);
        this.lastActive = now;
        this.ttl = timestamp ? ttl - now : ttl;
        this.refresh = !timestamp;
    }

    isDead(): boolean {
        const now = Math.floor(Date.now() / 1000);
        if (this.refresh) this.lastActive = now;

        return now - this.lastActive >= this.ttl;
    }
}

class Cache extends Manager {
    dataSet: DataSet;

    constructor() {
        super(Key.CACHE);
        this.dataSet = oldViersonHandler(this.dataSet);
    }

    get(key: string) {
        const data: Data | undefined = this.dataSet[key];
        if (!data) return undefined;
        if (data.isDead()) {
            delete this.dataSet[key];
            data.value = undefined;
        }
        this.dump();
        return data.value;
    }

    set(
        key: string,
        value: any,
        expire: number = MAXTTL,
        timestamp: boolean = false
    ) {
        this.dataSet[key] = new Data(value, expire, timestamp);
        this.dump();
    }

    clean() {
        const dataSet = this.dataSet;
        for (const key of Object.keys(dataSet)) {
            const data = dataSet[key];
            if (data.isDead()) delete dataSet[key];
        }
        this.dump();
    }

    clear() {
        this.dataSet = {};
        this.dump();
    }

    ttl(key: string, ttl?: number): number {
        if (ttl) this.dataSet[key].ttl = ttl;

        return this.dataSet[key].ttl;
    }
}

function oldViersonHandler(dataSet: object): DataSet {
    return Object.fromEntries(
        Object.entries(dataSet).map(([key, val]) => {
            const { value, timestamp, lastActive } = val;
            const data = new Data(value, MAXTTL);
            data.lastActive = timestamp ?? lastActive;
            return [key, data];
        })
    );
}

const cache = new Cache();

export default cache;
