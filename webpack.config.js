const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJson = require('./package.json');

const paths = {
    dist: path.resolve(__dirname, 'dist'),
    src: path.resolve(__dirname, 'src'),
};

module.exports = {
    entry: paths.src + '/scripts.js',
    output: {
        filename: 'main.js',
        path: paths.dist,
    },
    module: {
        rules: [
            {
                test: [/.js$|.ts$/],
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/typescript'],
                    },
                },
            },
            {
                test: /\.s*(c|a)ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images',
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-inline-loader',
                        options: {
                            idPrefix: true,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: paths.src,
        watchContentBase: true,
        compress: true,
        port: 18088,
        hot: true,
        inline: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: packageJson.title,
            template: './src/index.html',
            xhtml: true,
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ],
};
