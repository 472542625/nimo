module.exports = {
    entry: __dirname + '/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'nimo.js',
        libraryTarget: 'umd',
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        poll: 100,
        aggregateTimeout: 500,
        ignored: /node_modules/,
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                },
            }
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [],
}
