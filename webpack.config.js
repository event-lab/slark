'use strict';

var os = require('os');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsParallelPlugin = require('webpack-uglify-parallel');
var Visualizer = require('webpack-visualizer-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');
var px2rem = require('postcss-px2rem');

const DEVELOPMENT_PORT = 3007;
const SOURCE_PATH = 'src';
const RELEASE_PATH = 'dist';
const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const COMMON_CHUNK_NAME = 'vendors';

const NODE_ENV = process.env.NODE_ENV || PRODUCTION;

const uglifyJsOptions = {
    workers: os.cpus().length,
    output: {
        ascii_only: true,
    },
    compress: {
        warnings: false,
    },
    sourceMap: false
};

// default webpack config
let webpackConfig = {
    entry: {},
    output: {
        path: path.resolve(__dirname, `${RELEASE_PATH}`),
        filename: 'js/[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'babel'
                ]
            },
            {
                test: /\.css$/,
                loader: 'style!css?strictMath&noIeCompat!postcss',
            },
            {
                test: /\.less$/,
                loader: 'style!css!postcss!less'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=8196&name=[path]/[name]-[hash].[ext]'
            }
        ]
    },
    plugins: [
        new Visualizer({
            filename: './stats.html'
        }),
    ],
    postcss: function () {
        return [autoprefixer, precss, px2rem({
            rootValue: 200,
            remUnit: 75,
        })];
    }
};

// get entry
const entryFileNameList = glob.sync(path.join(SOURCE_PATH, 'entry') + '/*.js');
const entryNameList = entryFileNameList.map((entryFileName) => {
    return path.basename(entryFileName, '.js');
});

// set entry
entryNameList.forEach((entryName) => {
    webpackConfig.entry[entryName] = [
        path.join(__dirname, `./${SOURCE_PATH}/entry/${entryName}.js`)
    ];

    let htmlTemplateName = `template`;
    if (fs.existsSync(path.join(__dirname, `html/${entryName}.html`))) {
        htmlTemplateName = entryName;
    }
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        template: `html/${htmlTemplateName}.html`,
        filename: `html/${entryName}.html`,
        hash: true,
        inject: 'body',
        chunks: [
            COMMON_CHUNK_NAME,
            entryName
        ]
    }));
});

// set config according to environment
switch (NODE_ENV) {
    case DEVELOPMENT:

        entryNameList.forEach((entryName) => {
            webpackConfig.entry[entryName].unshift('webpack-dev-server/client?http://127.0.0.1:' + DEVELOPMENT_PORT);
            webpackConfig.entry[entryName].unshift('webpack/hot/log-apply-result');
            webpackConfig.entry[entryName].unshift('webpack/hot/only-dev-server');
        });

        webpackConfig.output.publicPath = `/${RELEASE_PATH}/`;
        webpackConfig.devtool = 'eval';

        webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
        webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

        webpackConfig.devServer = {
            hot: true,
            historyApiFallback: true,
            port: DEVELOPMENT_PORT,
            stats: {
                colors: true
            }
        };
        break;
    case PRODUCTION:

        webpackConfig.entry[COMMON_CHUNK_NAME] = [
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'redux-thunk',
            'redux-logger',
            `./${SOURCE_PATH}/library/BindReact`,
            `./${SOURCE_PATH}/library/createReducer`,
        ];

        webpackConfig.devtool = 'source-map';

        webpackConfig.module.loaders[1].loader = ExtractTextPlugin.extract("style-loader", "css-loader?-url");
        webpackConfig.module.loaders[2].loader = ExtractTextPlugin.extract("style-loader", "css-loader!less-loader?-url");
        webpackConfig.module.loaders[4].loader = 'url-loader?limit=8196&name=css/[path]/[name]-[hash].[ext]';

        webpackConfig.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(PRODUCTION)
            }
        }));
        webpackConfig.plugins.push(new UglifyJsParallelPlugin(uglifyJsOptions));
        webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: COMMON_CHUNK_NAME,
            filename: 'js/[name].js'
        }));
        webpackConfig.plugins.push(new ExtractTextPlugin(path.join('css/[name].css')));

        break;
    default:
        throw new Error('NODE_ENV not found, NODE_ENV=' + NODE_ENV);
}

module.exports = webpackConfig;
