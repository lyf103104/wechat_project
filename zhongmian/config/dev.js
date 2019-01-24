module.exports = {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {
        GLOBAL_CONFIG: JSON.stringify({
            Server: 'https://test-applet.cdfg.com.cn/api/overseas'
        })
    },
    weapp: {
        module: {
            postcss: {
                // 引用本地资源内联，taro-ui文档写错了
                url: {
                    enable: true,
                    config: {
                        limit: 1024000
                    }
                }
            }
        }
    },
    h5: {
        publicPath: '/',
        module: {
            postcss: {
                // 引用本地资源内联
                url: {
                    enable: true,
                    config: {
                        limit: 10240000
                    }
                }
            }
        }
    }
};
