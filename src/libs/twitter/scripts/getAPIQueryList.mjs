/* eslint-disable no-underscore-dangle */
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import graphqlQueryIdList from '../assets/graphql/graphqlQueryIdList.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// eslint-disable-next-line prettier/prettier
const operationNames = [
    'TweetDetail',
];

let context = 'const Endpoint = {\n';
context += operationNames
    .map(
        operationName =>
            `    ${operationName}: ${JSON.stringify(
                graphqlQueryIdList[operationName],
                null,
                8
            )}`
    )
    .join(',\n');

context += '\n};';

context += '\nexport default Endpoint;\n';

const filename = path.resolve(__dirname, '../endpoints.ts');

fs.writeFileSync(filename, context);

exec(`npx eslint --fix ${filename}`);
