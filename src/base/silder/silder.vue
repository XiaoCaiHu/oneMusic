<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="item"></span>
    </div>
  </div>
</template>
<script>
import Bscroll from 'better-scroll'
import {addClass} from 'common/js/dom'

export default {
  props: {
    //   循环轮播
      loop: {
          type: Boolean,
          default: true
      },
    //   自动轮播
      autoPlay: {
          type: Boolean,
          default: true
      },
    //   轮播时间间隔
      interval: {
          type: Number,
          default: 4000
      }
  },
  name:'',
  data(){
    return {
    // 轮播图各节点 
      children: [],
    // 轮播图小圆点
      dots: [],
    // 轮播小圆点
      currentPageIndex: 0,
    // 
      timer: {}
    }
  },
  beforeMount() {
     setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if(this.autoPlay){
            this._play()
        }
     }, 20);
    //  获取改变后的宽度
    window.addEventListener('resize',() => {
        if(!this.slider){
            return
        }
        this._setSliderWidth(true) //在内添加值，不让函数内执行宽度增加 
        this.slider.refresh()
    })
  },
  methods: {
      _setSliderWidth(isResize) {
        //   获取每个轮播图节点
        this.children = this.$refs.sliderGroup.children
        let width = 0
        // 获取slider实际宽度
        let sliderWidth = this.$refs.slider.clientWidth
        
        for(let i=0;i<this.children.length;i++){
            // 获取当前轮播节点
            let child = this.children[i]
            // 设置样式
            addClass(child,'slider-item')
            // 将sliderWidth宽的赋予到轮播图上
            child.style.width = sliderWidth + 'px'
            width += sliderWidth
        }
        if(this.loop && !isResize){
            // Bscroll循环轮播需要将容器宽度设为两倍
            width += 2 * sliderWidth
        }
        // 设置包裹轮播图容器的宽度
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
          this.dots = new Array(this.children.length)
      },
      // 通过Bscroll接口实现轮播动画效果
      _initSlider() {
          this.slider = new Bscroll(this.$refs.slider,{
             scrollX: true,         //横向滚动
             scrollY: false,        //竖直滚动关闭
             momentum: false,       //惯性滑动
             snap: true,            //滑动
             snapLoop: this.loop,   //滑动是否循环
             snapThreshold: 0.3,    //滑动阈值
             snapSpeed: 400,        //滑动速度
            //  click:true
          })
          // scrollEnd滚动结束时触发
          this.slider.on('scrollEnd',() => {
            //   获取当前轮播图编号
            //   getCurrentPage()为Bscoll中的方法,可以获取当前页面的索引
              let pageIndex = this.slider.getCurrentPage().pageX
              if(this.loop) {
                //   scroll会默认拷贝一个，所以要-1
                  pageIndex -= 1
              }
            //   大圆点对应轮播图编号
              this.currentPageIndex = pageIndex
              if(this.autoPlay) {
                  clearTimeout(this.timer)
                  this._play()
              }
          })
      },
    //   自动播放
      _play() {
          let pageIndex = this.currentPageIndex+1
        //   如果是循环播放需要再+1
          if(this.loop) {
              pageIndex += 1
          }
        //   设置轮播动画 
          this.timer = setTimeout(() => {
            //   goToPage(x,y,时间间隔,缓动数)  Bscroll的接口
              this.slider.goToPage(pageIndex,0,400)
          }, this.interval);
      }
     
  },
  // 销毁生命周期
  destroyed() {
    // 销毁轮播图计时
    clearTimeout(this.timer)
  }
}
</script>
<style scoped lang='stylus'>
@import "~common/stylus/variable"

  .slider
    min-height: 1px
    width: 100%;
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>