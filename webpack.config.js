const {resolve} = require('path');

const HtmlWebPackPlugin = require('html-webpack-plugin');


const config = {
    entry: {
        main: resolve('./src/index.js'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: 'url-loader?limit=25000'
            }
        ]
    },
    optimization: {
        minimize: true
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
    ]
};

module.exports = config;
