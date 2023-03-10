var path = require("path");
var webpack = require("webpack");
var path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// console.log("process.env = ",process.env);
// console.log("path = ",path.resolve(__dirname, './js/lib/upload.js'));
// console.log("path2 = ",path.resolve(__dirname, 'js','lib','upload.js'));
// console.log("path3 = ",path.resolve(__dirname, '/js','/lib','/upload.js'));
// console.log("dirname = ",__dirname);
//console.log("path test process.env.PATH = ",process.env.PATH);
//var t_path = path.resolve(__dirname, './js/lib/upload.js');
// const isProd = NODE_ENV === 'production';
const isProd = process.env.npm_lifecycle_event === 'build';
// const ifProd = x => isProd && x;// when using babel
// const ifProd = function(x){return isProd && x;};
const prodObj = isProd ? {
    // this is the url of our local sourcemap server
    //publicPath:  'http://localhost:80/joomla/components/com_arc/xfiles/js/dist/',
    //publicPath:  path.join(__dirname,'js','dist'),
    //append: '\n//# sourceMappingURL=https://localhost:80/[url]',
    filename: '[file].map'
} : {};

module.exports = {
  /*optimization: {
    minimize: false
  },//this doesn't seem to be doing anything anymore
  */
  externals: {
    /* @ comment out externals for/to create DynamicCdnWebpackPlugin scripts in ./dist/index.html file */
    'react': 'React',
    'react-dom': 'ReactDOM',
    // 'mobx': 'mobx',
    'axios': 'axios',
    // 'faker':'faker',// fails - faker doesn't need an external or an import in the component
    // 'tinycolor': 'tinycolor',
    // 'validator': 'validator',
    // 'linkify': 'linkify',
    // 'color':'Color',
    // 'draft-js':'draft-js',
    /*'react-hook-form':'react-hook-form'/*'ReactHookForm'*/
    // jquery: 'jQuery'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      }
    }
  },
  output: {
      chunkFilename: '[name].chunk.js',
      path: path.resolve(__dirname,'js','dist'),
      publicPath: 'oauth/src/js/dist/'
  },
  devtool: isProd ? false : 'cheap-module-eval-source-map',
  watch: true,
  watchOptions: {
    ignored: ['files/**/*.js', 'node_modules/**']
  },
  plugins:[
    new BundleAnalyzerPlugin(),
    new webpack.ProvidePlugin({
      /*$ : "jquery",
      jQuery : "jquery",*/
      /*React : "React",
      ReactDOM : "ReactDOM",*/
      test:path.join(__dirname,'js','lib','test.js')/* this works */,
      test2:path.join(__dirname,'js','lib','test2.js')/* this works */
    }),
    new webpack.SourceMapDevToolPlugin(prodObj),
    new MiniCssExtractPlugin({
        filename: "bundle.css"
    })
  ],
  module: {
    rules: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['@babel/preset-env','@babel/react'],
          plugins: [
            ["@babel/plugin-transform-runtime", {"regenerator": true,}],
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties"],
            ["@babel/plugin-syntax-dynamic-import"],
          ],
        }
      },
      {
        test: /\.(s*)?[ac]ss$/,
        use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { url: false, sourceMap: true } },
            {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
        ],
      }
    ]
  }
}//module


// module.export = {
//   optimization: {
//     minimize: false
//   },
//   devtool: 'cheap-module-eval-source-map',
//   module: {
//     rules: [{
//       test: require.resolve('./js/lib/upload.js'),
//       use: [{
//         loader: 'expose-loader',
//         options: 'makeContact'
//       }]
//     }]
//   }/*end module*/
// }//module
