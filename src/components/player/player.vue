<template>
  <div class="player" v-if="playlist.length>0">
    <transition name="normal" 
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <!-- 大播放器 -->
    <div class="normal-player" v-show="fullScreen">
        <!-- 背景 -->
        <div class="background">
          <img width="100%" height="100%" :src='cdimage'>
        </div>
        <!-- 头部标题/返回按钮 -->
        <div class="top">
            <!-- 返回 -->
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <!-- 标题 -->
          <h1 class="title" v-html="currentSong.title || currentSong.songname"></h1>
          <!-- 歌手名称 -->
          <h2 class="subtitle" v-html="currentSong.singer[0].name"></h2>
        </div>
        <div class="middle" 
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middlel">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClass">
                <img class="image" :src='cdimage'>
              </div>
            </div>
            <!-- 底部歌词展示 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词展示 -->
          <scroll class="middle-r" ref="lyricList" :data="lyric.ms">
            <div class="lyric-wrapper" ref="lyricWarpper">
                <div v-if="lyric">
                  <p ref="lyricLine"
                     class="text"
                     :class="{'current' : currentLineNum === index}"
                     v-for="(line,index) in lyric.ms"
                     :key="index">{{line.text}}</p>
                </div>
              </div>
          </scroll>
        </div>
        <!-- 底部播放按钮 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progressBar @percentChange='onProgressBarChange' :percent='percent'></progressBar>
            </div>
            <span class="time time-r">{{format(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)"  class="icon" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
    </div>
    </transition>
    <transition name="mini">
    <!-- 底部小播放器 -->
    <div class="mini-player" v-show="!fullScreen" @click="open">
         <div class="icon">
          <img :class="cdClass" :src='cdimage'  width="40" height="40" >
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.title || currentSong.songname"></h2>
          <p class="desc" v-html="currentSong.singer[0].name"></p>
        </div>
        <div class="control">
            <progressCircle :radius="radius" :percent="percent">
              <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon" ></i>
            </progressCircle>
        </div>
        <!-- 歌曲列表 -->
        <div class="control"  @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
    </div>
    </transition>
    <!-- 歌曲列表 -->
    <playlist ref="playlist"></playlist>
    <!-- 媒体播放器 -->
    <audio ref="audio" 
       :src="song" 
       @play="ready" 
       @error="error" 
       @timeupdate="updateTime" 
       @ended="end" 
    ></audio>
  </div>
</template>
<script>
import {playerMixin} from 'common/js/mixin'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
// 歌曲列表组件 
import playlist from 'components/playlist/playlist'
// 动画插件
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom' 
// 进度条
import progressBar from 'base/progress-bar/progress-bar'
//  
import progressCircle from 'base/progress-circle/progress-circle'
// 引入洗牌函数
// import {shuffle} from 'common/js/util'
import scroll from 'base/scroll/scroll'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins:[playerMixin],
  name:'',
  data(){
    return {
      songReady: false,
      currentTime: 0,
      radius:32,
      currentLineNum:0,
      currentShow: 'cd',
      playingLyric: '',
      timer:{}
    }
  },
  created() {
    this.touch = {}
  },
  components: {
    progressBar,
    progressCircle,
    scroll,
    playlist
  },
  computed: {
      ...mapGetters([
          'singer',
          'fullScreen',  //显示隐藏
   //控制整个播放器显示
          'song',
          'playing',
          'currentIndex',
          'lyric',
          'cdimage'
      ]),
// 音乐开关
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdClass() {
        return this.playing ? 'play' : 'pause'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
//  播放进度条播放比例
      percent() {
        return this.currentTime / this.currentSong.interval
      }
  },
  methods: {
    ...mapMutations({
          setfullScreen:'SET_FULL_SCREEN',
      }),
    ...mapActions({
          savePlayHistory:'savePlayHistory'
    }),
// 动画
   // el节点，done回调函数
      enter(el,done) {
        // 获取初始位置
        const {x, y, scale} = this._getPosAndScale()
        // 设置动画参数
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        // animations api
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        // 启用动画函数
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el,done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x,y,scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // 添加监听事件
         // transitionend 事件在 CSS 完成过渡后触发
        this.$refs.cdWrapper.addEventListener('transitionend',done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
         this.$refs.cdWrapper.style[transform] = ''
      },
// 以上动画
//   打开播放器页面
      open() {
          this.setfullScreen(true)
      },
//   关闭播放器页面
      back() {
          console.log(this.song);
          this.setfullScreen(false)
      },
// 当播放器准备好播放时
      ready() {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      error() {
        this.songReady = true
      },
//  显示歌曲列表
      showPlayList() {
        this.$refs.playlist.show()
      },
// 处理时间戳
      format(interval) {
        interval = interval | 0
        const minute = interval/60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
// 处理时间格式
      _pad(num,n = 2) {
        let len = num.toString().length
        while(len<n){
          num = '0' + num
          len++
        }
        return num
      },
// 播放进度发生改变时触发
      updateTime(e) {
        // 获取当前播放时间
        this.currentTime = e.target.currentTime
        // 歌词滚动
         this.lyric.ms.forEach((element,index) => {
        // console.log(element[index].time);
        // (this.currentTime<this.lyric.ms[index + 1].time && this.currentTime>this.lyric.ms[index].time)
          if(index >= this.lyric.ms.length-1){
            return
          }
          if(this.currentTime<this.lyric.ms[index + 1].time && this.currentTime>this.lyric.ms[index].time) {
            // this.$refs.lyricWarpper.style.top = -index * 2.5 + 6 + "rem";
            this.currentLineNum = index; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
            if(this.currentLineNum > 5){
              let lineEl = this.$refs.lyricLine[this.currentLineNum - 5]
              this.$refs.lyricList.scrollToElement(lineEl,1000)
            }else{
              this.$refs.lyricList.scrollToElement(0,0,1000)
            }
            // 唱片下显示歌词
            this.playingLyric = this.lyric.ms[this.currentLineNum].text
          }
        });
      },
// 获取目标初始位置
      _getPosAndScale() {
        // 小播放器
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
       // 大播放器
        const paddingTop = 80
        // 唱片图片宽度为屏幕宽度80%
        const width = window.innerWidth * 0.8
       // 缩小 
        const scale =  targetWidth/width 
        // 初始x坐标
        const x = -(window.innerWidth/2 - paddingLeft) 
        const y = window.innerHeight - paddingTop - width/2 - paddingBottom
        return {
          x,y,scale
        }
      },
      //歌曲开关 
      togglePlaying() {
        this.setPlayingState(!this.playing)
      },
// 歌曲前进与后退
      prev() {
        // 防止连续点击
        if(!this.songReady){
          return
        }
        let index = this.currentIndex - 1
        this.NextPrev({
             list:this.playlist,
             index:index
        })
        this.NextPrev2({
             list:this.playlist,
             index:index
        })
        // 当歌曲只有一个时,点击下一个进行循环
        if(this.playlist.length===1){
          this.loop()
          return
        }else{
           // 当歌曲到第一位时,序列号返回最后一个
           if(index === -1){
             index = this.playlist.length
             this.NextPrev({
                list:this.playlist,
                index:this.playlist.length
             })
           }
           this.setCurrentIndex(index)
        }

        if(!this.playing){
          this.togglePlaying()
        }
        this.songReady = false
      },
// 点击下一首歌曲
      next() {
        // 防止连续点击
        if(!this.songReady){
          return
        }
        let index = this.currentIndex + 1
        this.NextPrev({
             list:this.playlist,
             index:index
        })
        this.NextPrev2({
             list:this.playlist,
             index:index
        })
        // 当歌曲只有一个时,点击下一个进行循环
        if(this.playlist.length===1){
          this.loop()
          return
        }else{
           // 当歌曲到最后一位时,序列号返回第一个
           if(index === this.playlist.length){
             index = 0
             this.NextPrev({
                list:this.playlist,
                index:0
             })
           }
           this.setCurrentIndex(index)          
        }

        if(!this.playing){
          this.togglePlaying()
        }
        this.songReady = false
      },
// 歌曲播放完时
      end() {
        // 判断是否处在循环模式
        if(this.mode === playMode.loop){
          this.loop()
        }else{
          this.next()
        }
      },
// 循环
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      },
// ProgressBar组件传递过来改变播放值
      onProgressBarChange(percent) {
        //  改变播放器播放进度 当前总播放时间 * 百分比进度
        this.$refs.audio.currentTime = this.currentSong.interval * percent
        // 拖动前暂停,拖到后开始 
        if(!this.playing){
          // 歌曲开关
          this.togglePlaying()
        }
      },
// 歌曲进度开始点击
      middleTouchStart(e) {
        // 点击后信标为开启
        this.touch.initiated = true
        const touch = e.touches[0]
        // 获取点击x,y值
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
// 歌曲进度滑动时
      middleTouchMove(e) {
        if(!this.touch.initiated){
          return
        }
        const touch = e.touches[0]
        // 移动后当前位置-之前位置
        const delatX = touch.pageX - this.touch.startX  
        const delatY = touch.pageY - this.touch.startY
        // 当纵轴偏移大于横轴时,不滚动(防止滑歌词手误)
        if(Math.abs(delatY) > Math.abs(delatX)) {
          return
        }
        // 当页面处于cd页面时,起始点为0,否则转动页面宽度
        const left = this.currentShow === 'cd'? 0 : -window.innerWidth
        // 计算宽度
        const offsetWidth = Math.min(0,Math.max(-window.innerWidth,left + delatX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middlel.style.opacity = 1-this.touch.percent
        this.$refs.middlel.style[transitionDuration] = 0
      },
// 歌曲进度结束移动时
      middleTouchEnd() {
        let offsetWidth  
        let opacity
        if(this.currentShow === 'cd') {
          if(this.touch.percent>0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          }else {
            offsetWidth = 0
            opacity = 1
          }
        }else {
          if(this.touch.percent<0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          }else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.middlel.style.opacity = opacity
        this.$refs.lyricList.$el.style[transitionDuration] = time
        this.$refs.middlel.style[transitionDuration] = time
      }
  },
  watch: {
    // 监听歌曲变化
    song(newSong,oldSong) {
      //  判断
      if(!this.playing){
         return
      }else{
        clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.$refs.audio.play()
        },1000) 
      }    
    },
    // 监听播放开关
    playing(newPlaying) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>