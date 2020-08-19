const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const {PROJECT_PATH} = require('../constant')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const glob = require('glob')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = merge(common, {
    mode: 'production',
    devtool: 'none',
    plugins: [
        new CleanWebpackPlugin(),
        new PurgeCSSPlugin({
            paths: glob.sync(`${path.resolve(PROJECT_PATH, './src')}/**/*.{tsx,js,jsx,ts,scss,less,css}`, { nodir: true }),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',                   // 开一个本地服务查看报告
            analyzerHost: '127.0.0.1',            // host 设置
            analyzerPort: 3333,                           // 端口号设置
          }),
    ],
})