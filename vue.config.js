const path = require('path');//引入path模块

function resolve(dir){

    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径

}




module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    //以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: {//配置跨域
        '/api': {
            target: 'https://api.qq.jsososo.com',//这里后台的地址模拟的;应该填写你们真实的后台接口
            ws: true,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/api': ''//请求的时候使用这个api就可以
            }
        }
        
    }
},
  // devServer: {
  //   before(app) {
  //     app.get('/api/getDissList',function(req,res) {
  //       const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  //       axios.get(url,{
  //         headers: {
  //           referer:'https://c.y.qq.com',
  //           host: 'c.y.qq.com'
  //         },
  //         params: req.query
  //       }).then((res) => {
  //         res.json(res.data)
  //       })
  //     })
  //   }
  // },
  // 设置路径
  chainWebpack:(config)=>{

        config.resolve.alias
         .set('common',resolve('./src/common'))
         .set('components',resolve('./src/components'))
         .set('base',resolve('./src/base'))
         .set('assets',resolve('./src/assets'))
  }
  
  // publicPath:process.env.NODE_ENV === 'production' ? './' : '/'
}

