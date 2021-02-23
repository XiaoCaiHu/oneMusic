<template>
  <div class="music-list">
    <div class="back" @click="back">
        <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgIMAGE">
      <div class="play-wrapper">
        <div @click="random" class="play" v-show="songs.length>0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
        <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- listenScroll 监听滑动  -->
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data='songs' class="list" ref="list">
        <div  class="song-list-wrapper">
            <song-list @select="selectItem" :songs="songs" :rank="rank"></song-list>
        </div>
        <div class="loading-container" v-show="!songs.length">
            <loading></loading>
        </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import {prefixStyle} from 'common/js/dom'
import Loading from 'base/loading/loading'
import {mapActions,mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
// 预留高度
const RESERVED_HEIGHT = 40 
// 
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  props:{
      bgImage: {
          type: String,
          default: ''
      },
      songs: {
          type: Array,
          // default:() => []
          default: null
      },
      title: {
          type: String,
          default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
  },
  name:'',
  data(){
    return {
       scrollY:0,
       imageHeight:0,
       minTranlateY: 0,
       songRes: '',
       index: 0
    }
  },
  components: {
      Scroll,
      songList,
      Loading
  },
  created() {
    //   probeType listenScroll(监听滑动) better-scroll的方法
      this.probeType = 3
      this.listenScroll = true
  },
  beforeMount() {
      this.$nextTick(()=>{
          this._singerPic()
      })
  },
  methods: {
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    // vuex
    ...mapMutations({
      // 获取歌手
      setCdImage: 'SET_CDIMAGE'
    }),
    // 当底部播放器出现或消失的操作
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    //   歌曲列表根据图片大小设置top值
      _singerPic() {
        //   记录图片高度
          this.imageHeight = this.$refs.bgIMAGE.clientHeight
        //   最小滚动y值
          this.minTranlateY = -this.imageHeight + RESERVED_HEIGHT
        // 歌曲列表根据图片大小设置top值
          this.$refs.list.$el.style.top = `${this.$refs.bgIMAGE.clientHeight}` + 'px'
      },
    //   将滑动值赋予scrollY
      scroll(pos) {
          this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      // 获取歌曲
      // async _songRes(index) {
      //   const {data:{data:res}} = await this.$http.get('/song/urls',{params:{id:this.songs[index].mid}})
      //   this.songRes = res
      // },  
      // 打开选择的歌曲播放音乐
       selectItem(item,index) { 
   
         this.index = index
         this.selectPlay({
             list:this.songs,
             index:index
          })
          // 获取唱片图片
         this.setCdImage(this.bgImage)
      },
      // 随机播放
      random() {
        this.randomPlay({
          list:this.songs,
          index:this.index
        })
      }
  },
  watch: {
    //   监听y轴偏移量
      scrollY(newY) {
        //   设置背景图在图片顶部停止移动 (当背景滚动图片距离时停止移动)
          let translateY = Math.max(this.minTranlateY,newY)
          let zIndex = 0  //权重
          let scale = 1   //缩放
          let blur = 0    //模糊
          // 设置高斯模糊
          this.$refs.filter.style[backdrop] = `blur(${blur}px)`
         
          // 设置图背景偏移
          this.$refs.layer.style[transform]  = `translate3d(0,${translateY}px,0)`
          
          const percent = Math.abs(newY / this.imageHeight)
          // 当滑动大于零时,图片变大
          if(newY>0){
            scale = 1 + percent
            zIndex = 10
          }else{
            blur = Math.min(20 * percent,20)
          }
        //   当滚动达到预定值时,图片z-index变大，高度变小
          if(newY<this.minTranlateY) {
              zIndex = 10
              this.$refs.bgIMAGE.style.paddingTop = 0
              this.$refs.bgIMAGE.style.height = `${RESERVED_HEIGHT}px`
              this.$refs.playBtn.style.display = 'none'
          }else {
              this.$refs.bgIMAGE.style.paddingTop = '70%'
              this.$refs.bgIMAGE.style.height = 0
              this.$refs.playBtn.style.display = ''
          }
          this.$refs.bgIMAGE.style.zIndex = zIndex
          // 设置图片缩放
          this.$refs.bgIMAGE.style[transform]  = `scale(${scale})`
          
      }
  },
  computed: {
      bgStyle() {
          return `background-image:url(${this.bgImage})`
      },
    //   ...mapGetters([
    //   'singer'
    //  ])
  }
}
</script>
<style scoped lang='stylus'>
 @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background 
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>