const path = require('path')
const { PROJECT_PATH, isDev } = require('../constant')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const CopyPlugin = require('copy-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

const plugins = [
    new HtmlWebpackPlugin({
        template: path.resolve(PROJECT_PATH, './public/index.html'),
        filename: 'index.html',
        cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
        minify: isDev ? false : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true
        }
    }),
    new WebpackBar({
        name: isDev ? '正在启动' : '正在打包',
        color: '#fa8c16',
    }),
    new CopyPlugin({
        patterns: [
            {
                context: path.resolve(PROJECT_PATH, './public'),
                from: '*',
                to: path.resolve(PROJECT_PATH, './dist'),
                toType: 'dir',
            },
        ]
    }),
    // new HardSourceWebpackPlugin()
    new webpack.HotModuleReplacementPlugin({

    }),
];

!isDev && plugins.push(new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:8].css',
    chunkFilename: 'css/[name].[contenthash:8].css',
    ignoreOrder: false,
}))


const getCssLoaders = (importLoaders) => [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
        loader: 'css-loader',
        options: {
            modules: false,
            sourceMap: isDev,
            importLoaders,
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: [
                // 修复一些和 flex 布局相关的 bug
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                    autoprefixer: {
                        grid: true,
                        flexbox: 'no-2009'
                    },
                    stage: 3,
                }),
                require('postcss-normalize'),
            ],
            sourceMap: isDev,
        },
    },
]
module.exports = {
    entry: {
        app: path.resolve(PROJECT_PATH, './src/index.js'),
    },
    output: {
        filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
        path: path.resolve(PROJECT_PATH, './dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
            'Src': path.resolve(PROJECT_PATH, './src'),
            'Components': path.resolve(PROJECT_PATH, './src/components'),
            'Utils': path.resolve(PROJECT_PATH, './src/utils'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(tsx?|js)$/,
                loader: 'babel-loader',
                options: { cacheDirectory: true },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [...getCssLoaders(0)]
            },
            {
                test: /\.less$/,
                use: [
                    ...getCssLoaders(1),
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: isDev,
                        },
                    },
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    ...getCssLoaders(1),
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDev,
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        ...plugins,
    ],
    optimization: {
        minimize: !isDev,
        minimizer: [
            !isDev && new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: { pure_funcs: ['console.log'] },
                }
            }),
            !isDev && new OptimizeCssAssetsPlugin()
        ].filter(Boolean),
    }
}