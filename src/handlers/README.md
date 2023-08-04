## 如何贡献代码

### 1. 新增 Handler
各种 Handler 用来向页面添加播放器元素，新的 Handler 应该继承 ``handler.ts`` 中的 ``Handler``。

新的 ``NewHandler`` 应该实现：
- ``.canHandle(a: HTMLAnchorElement): boolean``：用于指示该 ``handler`` 是否能够处理 ``a`` 中携带的视频链接；
- ``.apply(a: HTMLAnchorElement): void``：用于实现具体实现。

除此以外新的 ``NewHandler`` 没有任何限制。更多例子参见本目录下的其他文件。

每个新的 ``NewHandler`` 应该独占一个文件，在完成 ``NewHandler`` 的实现后，调用 ``Handler.registerHandler(NewHandler)`` 注册，然后 ``NewHandler`` 的代码就会生效。

### 2. 修改已有的 Handler
不论是直接修改，还是通过继承重新实现，要求都与新增 Handler 相同。

### 3. 可用的工具
在 ``src/utils/utils.ts`` 中实现了一些工具函数。其中 ``insertVideoElement``、``insertHlsPlayer`` 和 ``insertIFrameElement`` 用于向页面插入播放器。

``insertVideoElement`` 用来向页面插入原生的 ``<video>`` tag，仅用于插入浏览器支持的视频格式，如 mp4。

``insertHlsPlayer`` 用于插入 HLS 格式的流式视频，基于 hls.js 实现。

``insertIFrameElement`` 用于插入实现了嵌入的视频播放器，比如 Youtube.

### 4. 代码风格
#### a. 整体风格
已经通过 eslint + prettier 实现约束，请尽量遵守，提交代码前现先格式化。对于特殊的情况，允许通过 ``// eslint-disable`` 命令禁用，比如：
```ts
// src/view/index.ts

// eslint-disable-next-line prettier/prettier
const views = [
    ct0View,
    loggedInView,
    guestView,
    updateInfoView,
];
```
当不确定 ``views`` 中是否还会添加新成员时，禁用是合理的。

#### b. 功能实现
在实现功能时应当采用简单易懂的编码方式，应该避免令人疑惑的代码。

#### c. 关于嵌套 if 和回调
i. 嵌套 if：应该采用提前退出。

ii. 回调：如果你的实现中存在多层回调，对于异步方法，请用 ``async/await`` 改写。
