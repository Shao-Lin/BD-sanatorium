import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin'; // Добавьте этот плагин
const __dirname = new URL('.', import.meta.url).pathname;

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: './src/index.js', // Главная точка входа
    update: './src/update.js', // Вход для update.js
    create: './src/create.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].bundle.js', // Создаст main.bundle.js и update.bundle.js
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        type: 'asset/resource', // Аналог url-loader
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        type: 'asset/resource', // Аналог file-loader
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './template.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './update.html', to: './' }, // Копируем update.html в dist
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './create.html', to: './' }, // Копируем create.html в dist
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './search.html', to: './' }, // Копируем update.html в dist
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Папка для обслуживания файлов
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Адрес вашего бэкенда
        secure: false,
        changeOrigin: true,
      },
    },
  },
};

