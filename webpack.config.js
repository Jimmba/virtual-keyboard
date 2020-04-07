const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
    const isProduction = options.mode === 'production';
    const config = {
        mode: isProduction ? 'production' : 'development',
        //devtool - mapping
        devtool: isProduction ? 'none' : 'source-map',
        //watch - режим выбирается в зависимости от запуска dev или prod
        watch: !isProduction,
        entry: ['./src/script.js', './src/style.scss'],
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'script.js'
        },
        module: {
            rules: [
                {
                    test: /\.?js$/,
                    exclude: /node_modules/, //исключаем папку из поиска js-файлов
                    use: {
                        loader: 'babel-loader',
                        options: {
                        presets: ['@babel/preset-env']
                        }
                    }
                }, {
                    test: /\.scss$/,
                    use: [
                        //Очередность выполнения задом наперед
                        //style-loader добавляет в html стили инлайн
                        //'style-loader','css-loader', 'sass-loader'
                        //вместо style-loader поставили MiniCssExtract
                        MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                    ]
                }, {
                    test: /\.(png|svg|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                }, {
                    test: /\.html$/i,
                    loader: 'html-loader',
                }
            ]
        },

        plugins: [
            //clean webpack plugin - очистка конечной директории перед упаковкой
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'style.css',
            })
        ]
    }

    return config;  
}