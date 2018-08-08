const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './scripts.dev.js',
    output: {
        filename: 'scripts.js',
        path: path.resolve(__dirname)
    },
    module: {
        rules: [{
            test: [/\.js$/, /\.jsx$/],
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    },
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 8080,
        public: "aws.dafox.uk",
        hot: true,
        inline: true,
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
