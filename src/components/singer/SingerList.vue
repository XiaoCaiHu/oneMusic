<template>
  <div class="SingerList">
        <ul class="list">
            <li @click="selectItem(item)" class="list-item" v-for="(item,index) in singerList" :key="index">
                <img  class="img" v-lazy="item.singer_pic" alt="">
                <span class="text">{{item.singer_name}}</span>
            </li>
        </ul>
  </div>
</template>
<script>
export default {
  props: {
    singerList: {
        type:Array,
        required:true
    }
  },
  name:'',
  data(){
    return {
       
    }
  },
  methods: {
    //   传递选择的歌手
      selectItem(item) {
          this.$emit('select',item)
      }
  }
}
</script>
<style scoped lang='stylus'>
@import "../../common/stylus/variable"

.SingerList
  box-sizing border-box
  .list
      margin 0 12px
      .list-item
          margin 15px 0
          .img
              display inline-block
              vertical-align top
              width 60px
              border-radius 50%
          .text
              display inline-block
              margin-left 10px
              vertical-align top
              line-height 60px
              font-size $font-size-medium-x
              color $color-text-l

</style>