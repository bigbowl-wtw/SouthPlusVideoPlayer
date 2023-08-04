export default abstract class Handler {
    /* 用于在 ``.canHandle`` 中匹配传入的 URL */
    abstract regex: RegExp;

    /**
     * 测试是否适用传入的超链接元素，返回值用于指示调用的 handler 能否处理传入的 URL
     *
     * @param a 待测试的超链接元素
     */
    abstract test(a: HTMLAnchorElement): boolean;

    /**
     * 插入播放器元素的具体实现
     *
     * @param a 可处理的超链接元素
     */
    abstract apply(a: HTMLAnchorElement): void;

    /* 实际生效的 handler */
    static handlers: HandlerConstructor[] = [];

    /**
     * 注册 handler 类，使代码生效
     *
     * @param handler 待注册的 handler 类
     */
    static registerHandler(handler: HandlerConstructor) {
        if (!Handler.handlers) Handler.handlers = [];

        Handler.handlers!.push(handler);
    }

    /**
     * TODO: 由于某些 handler 实现的 ``.apply`` 可能为异步方法，在页面上有多个匹配的
     *       URL 时，将产生状态冲突的问题（比如上次产生的 id 与本次冲突，而上次调用还未
     *       完成，不能简单的进行清理，进而影响到本次调用），且比较难以解决，因此采用每
     *       调用生成新实例的方法来避免。更好的方法待探索。
     */
    static process() {
        $<HTMLAnchorElement>('.tpc_content a')
            .filter((_, a) => /^http/.test(a.href))
            .each((_, a) => {
                for (const H of Handler.handlers) {
                    const handler = new H();
                    if (handler.test(a)) {
                        handler.apply(a);
                        break;
                    }
                }
            });
    }
}

type HandlerConstructor = new () => Handler;
