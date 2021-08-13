// 引入自定义配置模块
const rsaConfig = require("./src/rsaConfig.js");
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin"); // 压缩
// 生产包部署目录
const publicPath = process.env.VUE_APP_PUBLIC_PATH;
const siteName = rsaConfig.siteName;

module.exports = {
    publicPath, // 包部署目录
    outputDir: 'dist', // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录；注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)
    assetsDir: 'static', // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    indexPath: 'index.html', // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
    filenameHashing: true, // 生成文件是否带有 hash
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: siteName,
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'element-ui', 'index'],
        }
    },
    lintOnSave: false,
    productionSourceMap: process.env.NODE_ENV !== 'production', // 是否生成 source map
    devServer: {
        overlay: {
            warning: false,
            errors: false
        },
        host: '0.0.0.0',
        disableHostCheck: true,
        port: '8883',
        hot: true,
        open: true,
        proxy: { //反向代理
            '/api': {
                target: 'http://devznygmini.zhiscity.com',
                changeOrigin: true, //本地会虚拟一个服务端接收你的请求并代你发送该请求
                secure: false,
            }
        },
    },
    chainWebpack: config => {
        // 配置 scss 变量引入
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        oneOfsMap.forEach(items => {
            items
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: ['./src/assets/scss/common.color.scss', './src/assets/scss/common.variable.scss', './src/assets/scss/mixin.scss']
                })
                .end()
        });
        // 路径 rename
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'))
            .set('img', path.resolve(__dirname, './src/assets/img'));
        // 热更新
        config.resolve.symlinks(true);

        //生产环境，开启js\css压缩
        if (process.env.NODE_ENV === 'production') {
            console.log('------------', '生产环境，开启 js、css 压缩', process.env.NODE_ENV)
            config.plugin('compressionPlugin').use(new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.js$|\.css$/, // 匹配文件名
                threshold: 10240, // 对超过10k的数据压缩
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                deleteOriginalAssets: false // 不删除源文件
            }))
        }
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
            // config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];

            // 配置splitChunks(webpack4内置), 将公用组件，样式等等提取出来,减少打包体积
            config.optimization.splitChunks = {
                cacheGroups: {
                    common: {
                        name: 'chunk-common',
                        chunks: 'initial',
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        priority: 2,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    elementUi: {
                        name: 'element-ui',
                        test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                        chunks: 'all',
                        priority: 3,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            }
        }
    }
}