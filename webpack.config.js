const path = require('path')
const webpack = require('webpack')

module.exports = {
    devtool: false,
    entry: path.resolve(__dirname, 'src/index.ts'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'lms-connect.min.js',
        library: 'lms-connect',
        // Universal Module Definition
        libraryTarget:'umd'
    },

    resolve: {
		extensions: [' ', '.ts', '.js'],
	},

    module: {
        rules: [
            {
                test    : /\.js$/,
                exclude : [/(node_modules)/, path.resolve(__dirname, 'src/vendor/')],
                loader  : 'babel-loader',
            },
            {
                test: /\.ts(x?)$/,
                exclude : [/(node_modules)/],
                loader: 'babel-loader?presets[]=es2015!ts-loader',
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            mangle    : false,
            sourcemap : false,
            comments  : false,
            compress  : {
                warnings     : false,
                drop_console : false,
            }
        })
    ]
}
