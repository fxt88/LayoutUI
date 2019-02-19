// 配置
let envir = 'online'
let ENVIRONMENT_CONFIG = {}
let configMap = {
    test: {
      appkey: 'fe416640c8e8a72734219e1847ad2547',
      url: 'https://apptest.netease.im'
    },
    pre: {
      appkey: '45c6af3c98409b18a84451215d0bdd6e',
      url: 'http://preapp.netease.im:8184'
    },
    online: {
      appkey: '806da25767ec91783544ff4d2df0fbd6',
      url: 'https://ehospital.eureka-health.com:8022/api/'
    },
};
ENVIRONMENT_CONFIG = configMap[envir];


module.exports = ENVIRONMENT_CONFIG
