<template>
  <transition name="slide">
    <div class="user-center">
        <div @click="back" class="back">
            <i class="icon-back"></i>
        </div>
        <div class="switches-wrapper">
            <switches @switch='switchItem' :swicthes='swicthes' :currentIndex='currentIndex'></switches>
        </div>
        <div @click="random" ref="playBtn" class="play-btn">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
        </div>
        <div ref="listWrapper" class="list-wrapper">
            <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex === 0" :data='favoriteList'>
                <div class="list-inner">
                    <song-list2 @select='selectSong' :songs='favoriteList'></song-list2>
                </div>
            </scroll>
            <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data='playHistory'>
                <div class="list-inner">
                    <song-list2 @select='selectSong' :songs='playHistory'></song-list2>
                </div>
            </scroll>
        </div>
        <div class="no-result-wrapper">
          <noResult v-show="noResult" :title='noResultDsce'></noResult>
        </div>
    </div>
  </transition>
</template>
<script>
import switches from 'base/switches/switches'
import songList2 from 'base/song-list/song-list2'
import scroll from 'base/scroll/scroll'
import noResult from 'base/no-result/no-result'
import {playlistMixin} from 'common/js/mixin'
import {mapGetters,mapActions, mapMutations} from 'vuex'

export default {
  mixins:[playlistMixin],
  name:'',
  data(){
    return {
       currentIndex:0,
       swicthes:[
           {name:'我喜欢的'},
           {name:'最近听的'}
       ]
    }
  },
  components: {
      switches,
      songList2,
      scroll,
      noResult
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ]),
    noResult() {
      if(this.currentIndex===0) {
        return !this.favoriteList.length
      }else{
        return !this.playHistory.length
      }
    },
    noResultDsce() {
      if(this.currentIndex===0){
        return '暂无收藏歌曲'
      }else{
        return '你还没听过歌曲哦'
      }
    }

  },
  methods: {
    ...mapActions({
      insertSong:'insertSong',
      randomPlay:'randomPlay',
      randomPlay2:'randomPlay2'
    }),
    ...mapMutations({
      setCdImage:'SET_CDIMAGE'
    }),
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem(index) {
          this.currentIndex = index
      },
      selectSong(song) {
        // 播放器默认背景图
        this.setCdImage('http://p1.music.126.net/LpFu9pWQ3tzldjhkLwh4Vw==/109951165291444752.jpg?param=130y130')
        this.insertSong({
          song:song
        })
      },
      back() {
        this.$router.back()
      },
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if(list.length===0){
          return
        }
        // 播放器默认背景图
        this.setCdImage('http://p1.music.126.net/LpFu9pWQ3tzldjhkLwh4Vw==/109951165291444752.jpg?param=130y130')
        this.randomPlay({
          list:list,
          index:0
        })
        this.randomPlay2({
          list:list,
          index:0
        })
      }
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>