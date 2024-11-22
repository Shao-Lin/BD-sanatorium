import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const __dirname = new URL('.', import.meta.url).pathname;

export default {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js', // Главный файл входа
  output: {
    filename: 'bundle.js', // Имя файла сборки
    path: path.resolve(__dirname, 'dist'), // Куда будет сохранён файл
    publicPath: '/', // Обслуживание файлов с корня
    clean: true, // Очистка dist перед новой сборкой
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

