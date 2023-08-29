const { UserscriptPlugin } = require('webpack-userscript');
const { DefinePlugin } = require('webpack');
const path = require('path');
const fs = require('fs');
const $ = require('./package.json');
// const nodeExternals = require("webpack-node-externals");

$.name = 'South Plus 视频链接播放器';

function listDir(dirname, exclude) {
    const set = new Set(exclude);
    return fs
        .readdirSync(dirname)
        .filter(file => !set.has(file))
        .map(file => path.resolve(dirname, file));
}

module.exports = {
    mode: 'production',
    entry: [
        ...listDir(path.resolve(__dirname, 'src', 'handlers'), [
            'index.ts',
            'handler.ts',
            'README.md',
        ]),
        path.resolve(__dirname, 'src', 'index.ts'),
    ],
    externalsPresets: { node: true },
    externals: {
        'hls.js': 'Hls',
        'gm-requests': 'requests',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
    output: {
        filename: `${$.name}.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            sources: false,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(
                                __dirname,
                                './tsconfig.json'
                            ),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.txt$/,
                use: [
                    {
                        loader: 'text-loader',
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            $: 'jQuery',
        }),
        // 生成userscript header信息
        new UserscriptPlugin({
            headers: {
                name: $.name,
                version: $.version,
                author: $.author,
                license: `MIT`,
                icon: 'data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAUFNAA6Oj6AI6O6ABhYd8ANDTWAAcHzQD5+f4AzMz1AEVF2gAYGNEA7Oz7AGVl4ACjo+0AHBzSAMPD8wCWluoAaWnhAA8PzwBcXN4ALy/VAAICzADHx/QA5+f6ALq68QCNjegAMzPWAPj4/gBxceMAFxfRAL6+8gCRkekANzfXAN7e+ACxse8AhITmAO/v/ADCwvMAlZXqAGho4QAODs8A4uL5ALW18ACIiOcAW1veAC4u1QABAcwA8/P9AMbG9ACZmesAbGziAD8/2QC5ufEAX1/fADIy1gAFBc0A2dn3AKys7gBSUtwA6ur7AL298gCQkOkAY2PgADY21wDd3fgAg4PmAJSU6gBnZ+EAOjrYAA0NzwC0tPAAAADMANTU9gBNTdsAuLjxAIuL6AAEBM0Aq6vuAFFR3ADp6fsAvLzyAI+P6QBiYuAANTXXAAgIzgCvr+8AgoLmAKKi7ABISNoAs7PwACws1QDT0/YApqbtAExM2wAfH9IAt7fxAKqq7gBQUNwAIyPTAPf3/QDKyvQAcHDiABYW0ADb2/gArq7vAFRU3QD7+/4AoaHsAHR04wBHR9oAGhrRALKy8ACFhecAWFjeACsr1QD///8AeHjkAEtL2wAeHtIA8vL8AMXF8wCYmOoA9vb9AMnJ9ABvb+IAFRXQANra+AAmJtQAoKDsAHNz4wCTk+kAOTnXAAwMzgBKStsA8fH8AMTE8wCXl+oAamrhABAQzwDV1fcAqKjuAE5O3AAhIdMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaVU+cQIlJnt0BUxyZ1JCckgFRkZ0QEsUEVhYMl1GBR5gLUZGQ0pGNn1vRm8venwsVERxFAlnRogdRm0WRg+AJyKKcitGSXxRP3MZXipFVxEGIXcqRhJWRgspcgRfN0Y1clxbWEZGi38EGHJ1LU9GUmJJiSQ5RkZ0KCAIEWt5GHArBw5lHEYfTwpyNwZ6iwFJTUsiOoNGPGJBiC5CcYwdcmhGRigbEXh2HTgKOnIjGnJqf4ZycnJyclo9N4dThC4VYmMMQGQDdICFWwozF3JVRoAQTF5HCoUTWYE7cjCNRolOZhVuPDSCHEZGDX1GRgBrckwyMgRdbHV+YTFQBHshcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
                namespace: 'com.github.bigbowl-wtw',
                supportURL: $.bugs.url,
                homepage: $.homepage,
                description: $.description,
                match: [
                    '*://*.blue-plus.net/read.php*',
                    '*://*.east-plus.net/read.php*',
                    '*://*.imoutolove.me/read.php*',
                    '*://*.level-plus.net/read.php*',
                    '*://*.north-plus.net/read.php*',
                    '*://*.snow-plus.net/read.php*',
                    '*://*.soul-plus.net/read.php*',
                    '*://*.south-plus.net/read.php*',
                    '*://*.south-plus.org/read.php*',
                    '*://*.spring-plus.net/read.php*',
                    '*://*.summer-plus.net/read.php*',
                    '*://*.white-plus.net/read.php*',
                    '*://blue-plus.net/read.php*',
                    '*://east-plus.net/read.php*',
                    '*://imoutolove.me/read.php*',
                    '*://level-plus.net/read.php*',
                    '*://north-plus.net/read.php*',
                    '*://snow-plus.net/read.php*',
                    '*://soul-plus.net/read.php*',
                    '*://south-plus.net/read.php*',
                    '*://south-plus.org/read.php*',
                    '*://spring-plus.net/read.php*',
                    '*://summer-plus.net/read.php*',
                    '*://white-plus.net/read.php*',
                    // '*://localhost:9527/*',
                ],
                require: [
                    'https://cdn.jsdelivr.net/npm/hls.js@1.4.4/dist/hls.min.js',
                    'https://greasyfork.org/scripts/470000/code/GM%20Requests.js',
                ],
                grant: [
                    'GM.getValue',
                    'GM.setValue',
                    'GM_addStyle',
                    'GM_getValue',
                    'GM_info',
                    'GM_openInTab',
                    'GM_registerMenuCommand',
                    'GM_unregisterMenuCommand',
                    'GM_xmlhttpRequest',
                ],
                connect: [
                    'bilibili.com',
                    'b23.tv',
                    'youtube.com',
                    'youtu.be',
                    'twitter.com',
                    'twimg.com',
                    '91porny.com',
                    'jiuse.cloud',
                ],
            },
            pretty: true,
            strict: false,
        }),
    ],
    optimization: {
        minimize: false,
    },
};
