<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
        <div class="header">
            <h1 class="title">添加歌曲到列表</h1>
            <div class="close" @click="hide"> 
                <i class="icon-close"></i>
            </div>
        </div>
        <!-- 搜索框 -->
        <div class="search-box-wrapper">
            <searchBox ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></searchBox>
        </div>
        <!-- 搜索历史/播放历史 -->
        <div class="shortcut" v-show="!query">
            <switches @switch='switchItem' :swicthes='swicthes' :currentIndex='currentIndex'></switches>
            <div class="list-wrapper">
                <scroll ref="songList2" class="list-scroll" v-if="currentIndex === 0" :data='playHistory'>
                    <div class="list-inner">
                        <song-list2 @select='selectSong' :songs='playHistory'></song-list2>
                    </div>
                </scroll>
                <scroll :refreshDelay='refreshDelay' ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data='searchHistory'>
                    <div class="list-inner">
                        <search-list @select='addQuery' @delete='deleteSearchHistory' :searches='searchHistory'></search-list>
                    </div>
                </scroll>
            </div>
        </div>
        <!-- 搜索结果  -->
        <div class="search-result" v-show="query">
            <suggest :query="query" @select="saveSuggest" @listScroll="blurInput"></suggest>
        </div>
        <top-tip ref="topTip">
          <div class="tip-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放队列</span>
          </div>
        </top-tip>
    </div>
  </transition>
</template>
<script>

import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import SongList2 from 'base/song-list/song-list2'
import searchList from 'base/search-list/search-list'
import topTip from 'base/top-tip/top-tip'
import Scroll from 'base/scroll/scroll'
import {searchMixin} from 'common/js/mixin'
import {mapActions, mapGetters} from 'vuex'

export default {
  mixins:[searchMixin],
  name:'',
  data(){
    return {
       showFlag:false,
       currentIndex:0,
       swicthes: [
           {name:'最近播放'},
           {name:'搜索历史'}
       ]
    }
  },
  computed: {
      ...mapGetters([
          'playHistory'
      ])
  },
  components: {
      searchBox,
      suggest,
      Switches,
      SongList2,
      Scroll,
      searchList,
      topTip
  },
  methods: {
    ...mapActions({
        insertSong:'insertSong'
    }),
// 显示此页面
      show() {
          this.showFlag = true
          setTimeout(() => {
            if(this.currentIndex===0) {
              this.$refs.songList2.refresh()
            }else{
              this.$refs.searchList.refresh()
            }
          }, 20);
      },
// 隐藏此页面
      hide() {
          this.showFlag = false
      },
// 保存搜索结果
      saveSuggest() {
        this.saveSearch()
        this.showTip()
      },
// 改变最近播放,搜索历史样式
      switchItem(index) {
          this.currentIndex = index
      },
// 显示topTip(提示添加歌曲)
      showTip() {
        this.$refs.topTip.show()
      },
// 选择播放歌曲
      selectSong(song,index) {

        if(index !==0 ) {
          this.showTip()
          this.insertSong({
            song:song
          })
        }
      }
  }
}

</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>