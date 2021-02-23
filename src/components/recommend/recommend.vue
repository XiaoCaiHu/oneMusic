<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" v-show="diskList" :data='diskList.list'>
      <div>
      <!-- 轮播 -->
        <div v-if="banner.length" class="slider-wrapper">
          <!-- 轮播组件 -->
          <slider>
             <div v-for="item in banner" :key="item.id">
               <a :href="item.h5Url">
                 <!-- 给图片绑定load事件，保证图片在列表数据值前渲染 -->
           <!-- fastclick在使用时会经常性的将BScroll的click拦截掉 解决方法class加needsclick -->
                 <img class="needsclick" @load="loadImg" :src="item.picUrl" alt="">
               </a>
             </div>
          </slider>
        </div>
        <!-- 歌单推荐 -->
        <div class="recommend-list" >
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" class="item" v-for="item in diskList.list" :key="item.tid">
                <div class="icon">
                  <img width="68" height="68"  v-lazy="item.cover_url_big" alt="">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.title"></h2>
                  <p class="desc">富强、民主、文明、和谐、自由...</p>
                </div>
              </li>
            </ul>
        </div>
     </div>
     <div class="loading-container" v-show="!diskList.list">
       <loading></loading>
     </div>
     <router-view></router-view>
    </scroll>
    
  </div>
</template>
<script>
// import {getRecommend} from '../../api/recommend.js'
// import {ERR_OK} from '../../api/config.js'
import slider from 'base/silder/silder'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins: [playlistMixin],
  name:'recommend',
  data(){
    return {
       banner:[],         //轮播图数据
       diskList:{
         type: Array,
         default: () => []
       },       //推荐列表数据
       checkLoad: false   //判断轮播图是否存在
    }
  },
  components: {
    slider,
    Scroll,
    loading
  },
  methods: {
     ...mapMutations({
       setDisc:'SET_DISC'
     }),
    // 当底部播放器出现或消失的操作
     handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    //轮播图数据
      async _getRecommend() {
        const res = await this.$http.get('/recommend/banner')
           if(res.status===200){
             this.banner = res.data.data
           }
      },
      // 当加载第一张图片后,刷新页面高度，防止塌陷
      loadImg() {
        if(!this.checkLoad){
          this.$refs.scroll.refresh()
          this.checkLoad = true
        }
      },  
    //推荐列表数据  
      async _getDiskList() {
        const res = await this.$http.get('/recommend/playlist')
        if(res.status===200){
             this.diskList = res.data.data
        }
        console.log(this.diskList.list);
      },
      selectItem(item) {
        console.log(item.tid);
        this.$router.push('/recommend/' + item.tid)
        this.setDisc(item)
      }
      
  },
  created() {
      this._getRecommend()
      setTimeout(() => {
          this._getDiskList()      
      }, 200);   
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    left: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            // 纵向排列
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>