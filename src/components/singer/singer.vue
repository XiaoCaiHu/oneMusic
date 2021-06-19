<template>
  <div class="singer" >
    <scroll class="singer-content" :data='singList' ref="singers">
    <div>
       <singerCategory 
           :category = 'singerCategory'
           :singerA = 'singerA'
           @category-list = '_getSingerList'
       ></singerCategory>
       <singerList
           :singerList = 'singList'
           @select = 'selectSinger'
       ></singerList>
       <div class="loading-container" v-show="!singList.length">
         <loading></loading>
       </div>
    </div>
    </scroll>
     <!-- 名字首字母@click="stand(index)"  -->
    <ul class="singera-list">
        <li v-for="(item,index) in singerA" 
            :class="{'singera-active':activeIndex===index}" 
            @click="stand(index)"
            class="singera-item" 
            :key="index">{{item.name}}
        </li>
    </ul>
    <router-view></router-view>
  </div>
</template>
<script>
import {getSingerList} from '../../api/singerList.js'
import SingerCategory from './SingerCategory'
import SingerList from './SingerList'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  name:'',
  data(){
    return {
       singList: [],
       singerCategory: {},
       singerA: [],
       activeIndex: 0,
       params:{
         sex: -100,
         genre: -100,
         area: -100,
         index: -100
       }
    }
  },
  components:{
    SingerCategory,
    SingerList,
    Scroll,
    loading
  },
  methods: {
    // vuex
    ...mapMutations({
      // 获取歌手
      setSinger: 'SET_SINGER',
      setCdImage: 'SET_CDIMAGE'
    }),
    // 当底部播放器出现或消失的操作
     handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '70px' : ''
      this.$refs.singers.$el.style.bottom = bottom
      this.$refs.singers.refresh()
    },
    // 获取歌手列表 
    async _getSingerList(params) {
      const res = await this.$http.get(getSingerList.url,{params:params})
      if(params){
        this.params = params
      }
      if(res.status===200){
        this.singList = res.data.data.list
      }
    },
    // 获取歌手分类
    async _getSingerCategory(){
      const { data: { data: category } } = await this.$http.get('/singer/category')
        this.singerCategory = {
          sex: category.sex,
          area: category.area,
          genre: category.genre
        },
        this.singerA = category.index
    },
    // 根据首字母获取歌
    stand(index) {
      this.activeIndex = index
      this.params.index = this.singerA[index].id
      const paramss = this.params
      this._getSingerList(paramss)
    },
    //跳转到对应歌手页面
    selectSinger(singer) {
       this.$router.push('/singer/' + singer.singer_mid)
       this.setSinger(singer)
      //  console.log(singer.singer_pic);
      //  this.setCdImage(singer)
    }
  },
  created() {
    // 获取歌手分类
    this._getSingerCategory()
    // 获取歌手列表
      this._getSingerList()
  }
}
</script>
<style scoped lang='stylus'>
@import "../../common/stylus/variable"
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
  overflow: hidden;
  .singer-content
    position: fixed
    top: 88px
    bottom: 0
    overflow: hidden
    .loading-container
       position: absolute
       width: 100%
       top: 50%   
  .singera-list
    position absolute
    top 50%
    transform translateY(-50%)
    right -21px
    .singera-item
      font-size $font-size-medium-x
      color $color-text-l 
    .singera-item:first-child
       letter-spacing 6px
       font-size 15px
    .singera-active
      color $color-theme
</style>