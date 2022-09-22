const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const filename = (name, extension) => isDev ? `${name}.${extension}` : `${name}.[hash].${extension}`

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: "./index.js"
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
    alias: {
        "@": path.resolve(__dirname, 'src'),
        "@types": path.resolve(__dirname, 'src/types'),
        "@components": path.resolve(__dirname, 'src/components'),
        "@utils": path.resolve(__dirname, "src/utils"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@store": path.resolve(__dirname, "src/store"),
        "@constants": path.resolve(__dirname, "src/constants"),
    }
},
  optimization: {
    minimizer: [
        new TerserWebpackPlugin()
    ],
    splitChunks: {
        chunks: 'all',
        minSize: 1,
        minChunks: 2
    }
  },
  devServer: {
    port: 2345,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test:  /\.(js|jsx|ts|tsx)$/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/env','@babel/react']
            }
        },
        exclude: /node_modules/
      },
      {
        test: /\.ts(x?)$/,
        use: {
            loader: "ts-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./index.html",
        minify: {
            removeComments: isProd
        }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
            from: path.resolve(__dirname, "public/favicon.ico"),
            to: path.resolve(__dirname, "dist")
        },
        {
            from: path.resolve(__dirname, "public/manifest.json"),
            to: path.resolve(__dirname, "dist")
        }
    ]
    }),
    new MiniCssExtractPlugin({
        filename: filename("bundle", "css")
    })
  ]
}