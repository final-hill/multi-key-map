/*!
 * @license
 * Copyright (C) 2020 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import path from 'path';
import url from 'url';
import ESLintPlugin from 'eslint-webpack-plugin';

const __filename = url.fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

export default {
    devtool: 'source-map',
    entry: './src/index.mts',
    experiments: {
        outputModule: true
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        clean: true,
        library: {
            type: 'module'
        },
        module: true,
        filename: 'index.mjs',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['mts'],
            exclude: 'node_modules',
            failOnError: true,
            failOnWarning: true,
            files: 'src'
        })
    ],
    resolve: {
        extensions: ['.mts']
    }
};