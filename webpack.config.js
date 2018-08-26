const path = require('path');

const BUILD_PATH = 'frontendBuild'

module.exports = {
    entry: './frontendSrc/index.html',
    output: {
        path: path.resolve(__dirname, BUILD_PATH),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.jsx?$/, 
                loader: 'babel-loader', 
                exclude: /node_modules/ 
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    devServer: {
        contentBase: './' + BUILD_PATH
    }
};
