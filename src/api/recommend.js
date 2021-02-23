// // 导入jsonp  （jsonp的作用是跨域请求数据）
// import jsonp from 'common/js/jsonp.js'
// import { commonParams,option } from './config'
// // 获取recommend页面的数据
// export function getRecommend() {
//     const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

//     const data = Object.assign({},commonParams,{
//         platform: 'h5',
//         uin: '',
//         needNewCode: 1
//     })
//     return jsonp(url,data,option)
// }

//引入需要的config配置的参数
import {commonParams,options} from './config'
import jsonp  from 'common/js/jsonp.js'

//获取到推荐的信息谁
// export function getRecommend(){
//     const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
//     const data=Object.assign({},commonParams,{
//         platfrom: 'h5',
//         notice: 0,
//         uin: 0,
//         needNewCode: 1
//     })   
//    return jsonp(url,data,options)
// }
export function getRecommend() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  
    const data = Object.assign({}, commonParams, {
      platform: 'h5',
      uin: 0,
      needNewCode: 1
    })
  
    return jsonp(url, data, options)
  }