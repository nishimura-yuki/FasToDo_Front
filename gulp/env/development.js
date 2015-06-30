var path = require('path');
var webpack = require("webpack");

var src = './_src';  // ソースディレクトリ
var dest = './dest'; // 出力先ディレクトリ
var relativeSrcPath = path.relative('.', src);
var absoluteSrcPath = path.resolve(src);

console.log(absoluteSrcPath);


module.exports = {
    task:{
        // webpackの設定
        webpack: {
            plugins: [
                new webpack.ProvidePlugin({
                    React: 'react/addons',
                    ReactIntl: 'react-intl',
                    Request: absoluteSrcPath +'/javascripts/util/request.js',
                    ReactRouter: 'react-router',
                    Define: absoluteSrcPath + '/define/development.json'
                })
            ]
        },
    }
}
