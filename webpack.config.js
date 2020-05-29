var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry : './chrome_extension/warfarin/popup-react/index.js',
    output : {
        path : path.resolve(__dirname, "chrome_extension", "warfarin", "popup-build"),
        filename : 'bundle.js'
    },
    module : {
        rules : [
            { test : /\.(js)$/, use : 'babel-loader'},
            { test : /\.css$/, use : ['style-loader', 'css-loader']},
            { test : /\.(png|svg|jpg|gif)$/, use : ['file-loader']}
        ]
    },
    mode : 'development',
    plugins : [
        new HtmlWebpackPlugin({
            template : './chrome_extension/warfarin/popup-react/index.html'
        })
    ],
    devtool : 'cheap-module-source-map',
    devServer : {
        contentBase : path.resolve(__dirname, "chrome_extension", "warfarin", "popup-build")
    }
}