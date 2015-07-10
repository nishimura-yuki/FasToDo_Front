var path = require('path');
var webpack = require("webpack");
var minimist = require("minimist");
var extend = require("extend");

var args = minimist(process.argv.slice(2))
var env = args.ENV;
if(env == null){
    env = "development";
}

var src = './_src';  // ソースディレクトリ
var dest = '../app/public'; // 出力先ディレクトリ
var relativeSrcPath = path.relative('.', src);
var absoluteSrcPath = path.resolve(src);

var c = {
    config: {
        src: src,
        dest: dest,

        // jsのビルド設定
        js: {
            src: src + '/javascripts/**',
            dest: dest + '/javascripts',
            uglify: false
        },
        jsx: {
            src: src + '/javascripts/**',
            dest: dest + '/javascripts',
            uglify: false
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
            entry: {
                app: src + '/javascripts/app.jsx',
              //  signup: src + '/javascripts/signup.jsx',
              //  login: src + '/javascripts/login.jsx'
            },
            output: {
                filename: "[name].js"
            },
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    { test: /\.jsx$/, loader: 'jsx-loader' },
                    { test: /\.json$/, loader: 'json-loader' },
                    { test: /\.css$/, loader: "style!css" } ,
                    { test: /\.gif$/, loader: "url-loader" }
                ]
            },
            node: {
                fs: "empty",
                net: "empty"
            },
            resolve: {
                extensions: ['', '.js', '.jsx', '.css', '.json']
            },
            /*
            plugins: [
                new webpack.ProvidePlugin({
                    React: 'react/addons',
                    ReactIntl: 'react-intl',
                    Request: absoluteSrcPath +'/javascripts/util/request.js',
                    ReactRouter: 'react-router',
                    messages: absoluteSrcPath + '/js/common/locals.js',
                    settings: absoluteSrcPath + '/settings/develop.json',
                    I18n: absoluteSrcPath +'/js/common/i18n.jsx'
                })
            ]
            */
        },
        watch: {
            webpack: relativeSrcPath + '/+(javascripts|stylesheets|locals|settings)/**/*.*',
            img: relativeSrcPath + '/images/*.*',
            ejs: relativeSrcPath + '/**/*.ejs'
        },
        ejs: {
            src: src + '/{,**/}*.ejs',
            dest: './dest' ,
            config: src + '/ejs.json'
        }

    }

}

var env_conf = require("./env/" + env);
extend( true, c, env_conf );
console.log(c);

module.exports = c;
