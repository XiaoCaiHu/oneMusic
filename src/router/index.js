import Vue from 'vue'
import VueRouter from 'vue-router'
const Recommend = ()=>import("components/recommend/recommend")
const Rank = ()=>import("components/rank/rank")
const Search = ()=>import("components/search/search")
const Singer = ()=>import("components/singer/singer")
const SingerDetail = ()=>import("components/singerDetail/singerDetail")
const Disc = ()=>import("components/disc/disc")
const userCenter = ()=>import("common/user-center/user-center")

// 注册路由 
Vue.use(VueRouter)

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path:'/',
    redirect:'/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: '/recommend/:id', //注意写法(我去™的)
        component: Disc
      }
    ]
  },
  {
    path:'/rank',
    component: Rank
  },
  {
    path:'/search',
    component: Search
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: '/singer/:id', //注意写法(我去™的)
        component: SingerDetail
      }
    ]
  },
  {
    path:'/user',
    component: userCenter
  }
]

const router = new VueRouter({
  routes
})

export default router
