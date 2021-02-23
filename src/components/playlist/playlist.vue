<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
        <!-- 歌曲列表 -->
        <div class="list-wrapper" @click.stop>
            <!-- 歌曲列表头部 -->
            <div class="list-header">
                <h1 class="title">
                    <i class="icon" :class="iconMode" @click="changMode"></i>
                    <span class="text">{{modeText}}</span>
                    <!-- 垃圾桶(清空) -->
                    <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
                </h1>
            </div>
            <!-- 歌曲列表内容 -->
            <scorll ref="listContent" :refreshDelay='refreshDelay' :data='sequenceList' class="list-content">
              <!--  列表动画 -->
                <transition-group name="list" tag="ul">
                    <li ref="listItem" class="item" v-for="(item,index) in sequenceList" :key="item.mid || item.songmid" @click="selectIcon(item,index)">
                        <!-- 当前播放歌曲 -->
                        <i class="current" :class="getCurrentIcon(item)"></i>
                        <span class="text">{{item.title || item.songname}}</span>
                        <!-- 喜爱 -->
                        <span @click.stop="toggleFavorite(item)" class="like">
                            <i :class='getFavoriteIcon(item)'></i>
                        </span>
                        <!-- 删除 -->
                        <span class="delete" @click.stop="deleteOne(item)">
                            <i class="icon-delete"></i>
                        </span>
                    </li>
                </transition-group>
            </scorll>
            <!-- 添加歌曲 -->
            <div class="list-operate">
                <div class="add" @click="addSong">
                    <i class="icon-add"></i>
                    <span class="text">添加歌曲到队列</span>
                </div>
            </div>
            <div class="list-close">
                <span @click="hide">关闭</span>
            </div>
        </div>
        <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
        <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>
<script>
import {mapActions, mapMutations} from 'vuex'
import {playMode} from 'common/js/config'
import Scorll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import addSong from 'components/add-song/add-song'
import {playerMixin} from 'common/js/mixin'

export default {
  mixins:[playerMixin],
  name:'',
  data(){
    return {
       showFlag:false,
       refreshDelay: 100
    }
  },
  components: {
      Scorll,
      Confirm,
      addSong
  },
  computed: {
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
      }
  },
  methods: {
      ...mapActions({
          switchSong:'SWITCHSONG',
          deleteSong:'deleteSong',
          deleteSongList:'deleteSongList'
      }),
      ...mapMutations({
        setPlaying:'SET_PLAYING'
      }),
// 显示清空播放列表提示框
      showConfirm() {
        this.$refs.confirm.show()
      },
// 清空播放列表
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
// 显示列表
      show() {
          this.showFlag = true
          setTimeout(() => {
              this.$refs.listContent.refresh()
              this.scrollToCurrent(this.currentSong)
          },20)
      },
// 隐藏列表
      hide() {
          this.showFlag = false
      },
// 删除选择歌曲项
      deleteOne(item) {
        this.deleteSong(item)
        if(this.playlist.length === 0) {
            this.hide()
        }
      },
// 显示添加歌曲页面
      addSong() {
        this.$refs.addSong.show()
      },
//   当前播放歌曲样式
      getCurrentIcon(item) {
          if(this.currentSong.id) {
             if(this.currentSong.mid === item.mid) {
               return 'icon-play'
             }
                return ''
          }else {
             if(this.currentSong.songmid === item.songmid) {
               return 'icon-play'
             }
               return '' 
          }
      },
//播放选择歌曲   
      selectIcon(item,index) {
        //   如果当前播放模式为随机播放
          if(this.mode === playMode.random) {
            //   找到原歌曲列表中的对应歌曲
              index = this.playlist.findIndex((song) => {
                  return song.id === item.id
              })
          }
        // 索引变为当前选择的列
          this.setCurrentIndex(index)
        //   获取歌曲/歌词
          this.switchSong({
             item:item
          })
        //   播放状态true
          this.setPlaying(true)
      },
//   播放歌曲滚动至当前歌曲
      scrollToCurrent(current) {
        //   找到current索引
        if(current.id) {
           const index = this.sequenceList.findIndex((song) => {
              return current.mid === song.mid
           }) 
            //   调用listContent scroll滚动到当前播放歌曲位置
           this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
        }else{
           const index = this.sequenceList.findIndex((song) => {
              return current.songmid === song.songmid
           })  
            //   调用listContent scroll滚动到当前播放歌曲位置
           this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
        }      
      }
  },
  watch: {
// 监听currentSong
      currentSong(newSong,oldSong) {
          if(oldSong.id) {
              if(!this.showFlag || newSong.mid === oldSong.mid) {
                return
              }
            //   改变列表位置
              this.scrollToCurrent(newSong)
          }else {
              if(!this.showFlag || newSong.songmid === oldSong.songmid) {
                return
              }
            //   改变列表位置
              this.scrollToCurrent(newSong)
          }        
     }
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          // 删除动画
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>