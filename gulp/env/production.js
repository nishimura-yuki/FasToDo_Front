var path = require('path');
var webpack = require("webpack");

var src = './_src';  // ソースディレクトリ
var dest = '../app/public'; // 出力先ディレクトリ
var relativeSrcPath = path.relative('.', src);
var absoluteSrcPath = path.resolve(src);

module.exports = {
    config: {
        src: src,
        dest: dest,
        // jsのビルド設定
        js: {
            src: src + '/javascripts/**',
            dest: dest + '/javascripts',
            uglify: true 
        },
        jsx: {
            src: src + '/javascripts/**',
            dest: dest + '/javascripts',
            uglify: true 
        }
    }, 
    task:{
        copy: {
            src: [
                src + '/{,**/}*.ejs'
            ],
            dest: '../app/views' 
        },
        imagemin: {
            src: src + '/images/**/*.+(jpg|jpeg|png|gif|svg)',
            dest: dest + '/images'
        },
        // webpackの設定
        webpack: {
            plugins: [
                new webpack.ProvidePlugin({
                    React: 'react/addons',
                    ReactIntl: 'react-intl',
                    Request: absoluteSrcPath +'/javascripts/util/request.js',
                    ReactRouter: 'react-router',
                    Define: absoluteSrcPath + '/define/production.json',
                    Messages: absoluteSrcPath + '/javascripts/util/locals.js'
                })
            ]
        },
    }
}

