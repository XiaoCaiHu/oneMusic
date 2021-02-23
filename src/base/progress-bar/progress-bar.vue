<template>
<!-- 进度条 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- 拖拽点 -->
      <div class="progress-btn-wrapper" ref="progressBtn"
         @touchstart.prevent = 'progressTouchStart'
         @touchmove.prevent = 'progressTouchMove'
         @touchend.prevent = 'progressTouchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {prefixStyle} from 'common/js/dom'

// 小球按钮宽度
const progressBarWidth = 16
// 
const transform = prefixStyle('transform')

export default {
  props: {
      percent: {
          type: Number,
          default: 0
      }
  },
  name:'',
  data(){
    return {
    //    touch:{}
    }
  },
  created() {
    //   方便每次换页传参
      this.touch = {}
  },
  methods: {
    //  改变进度条
      _offset(offsetWidth) {
          this.$refs.progress.style.width = `${offsetWidth}px`
        //   小球按钮偏移
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }, 
      progressTouchStart(e) {
        //   标志位,用来给移动位判断是否点击到了 
          this.touch.initiated = true
        //   获取点击位置
          this.touch.startX = e.touches[0].pageX
        //   获取进度条进度
          this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        //   如果没有进入到触摸位, 设置无法滑动
          if(!this.touch.initiated){
              return
          }
        //   在移动时,实时获取移动的偏移量 (当前位置 - 之前点击位置)
          const delatX = e.touches[0].pageX - this.touch.startX
        //   进度条应当被滑动到的位置 (之前位置 + 移动的位移) 
            //  移动不能小于0,也不能大于进度条最大宽度
          const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBarWidth,Math.max(0,this.touch.left + delatX)) 
          
          this._offset(offsetWidth)
     },
      progressTouchEnd() {
        //   结束按压时,标志位false
          this.touch.initiated = false
        // 
          this._triggerPercent()
      },
    //   计算进度条
      _triggerPercent() {
          const barWidth =  this.$refs.progressBar.clientWidth - progressBarWidth 
        //  进度条运动的百分比 =  当前进度 / 总进度宽度 
          const percent = this.$refs.progress.clientWidth / barWidth
          this.$emit('percentChange',percent)
      },
    //   点击改变进度条进度
      progressClick(e) {
        // 当我们点击progressBtn  e.offsetX获取不正确
          // this._offset(e.offsetX)
          const rect = this.$refs.progressBar.getBoundingClientRect()
          const offsetWidth = e.pageX - rect.left
          this._offset(offsetWidth)
          this._triggerPercent()
      }
  },
  watch: {
    //   监听播放比例
      percent(newPercent) {
          if(newPercent >= 0 && !this.touch.initiated) {
            //   进度条总宽度 = 组件宽度 - 小球宽度
              const barWidth =  this.$refs.progressBar.clientWidth - progressBarWidth
            //   歌曲当前宽度(进度)
              const offsetWidth = newPercent * barWidth

              this._offset(offsetWidth)
          }
      }
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>