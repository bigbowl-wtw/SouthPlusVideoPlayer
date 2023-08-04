import { dump } from '../utils/utils';

interface DataSet {
    [propName: string]: any;
}

export default class Manager {
    protected dataSet: DataSet;
    protected key: string;
    protected dump = dump;

    constructor(protected name: string) {
        this.dataSet = GM_getValue(name, {});
    }
}
