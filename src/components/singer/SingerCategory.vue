<template>
  <div class="SingerCategory">
      <!-- 先遍历对象 -->
    <div class="category-wrapper" v-for="(value, key) of category" :key="key">
        <ul class="category-list">
            <!-- 遍历数组 -->
            <li class="category-item" 
                v-for="(category,index) in value" 
                :key="category.id"
                :class="{ 'singer-active': activeIndex[key] === index }"  
                @click="categoryClick(key, index)"  
            >
                {{category.name}}
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    category: {
       type:Object,
       required:true
    }
  },
  name:'',
  data(){
    return {
       activeIndex: {
           sex: 0,
           genre: 0,
           area: 0
       }
    }
  },
  methods: {
    //   改变分类
    categoryClick(key,index) {
        this.activeIndex[key] = index
        // 创建存储params的对象,以便于传值到主组件中
        const params = {}
        for(key in this.activeIndex){
            // 获得当前所选标签的id值   id值可能为地区,姓名等...
            params[key] = this.category[key][this.activeIndex[key]].id 
        }
        // 创建方法,将params传递给父组件
        this.$emit('category-list',params)
    }
  }
}
</script>
<style scoped lang='stylus'>
@import "../../common/stylus/variable"
.SingerCategory
  position relative
  margin-top 10px
  .category-wrapper
     display flex
     flex-direction column
     .category-list
       display flex
       flex-direction row
       flex-wrap wrap
       margin 0 12px
       .category-item
         margin 0 10px 20px 0
         padding 3px 5px
         font-size $font-size-small
         color $color-text-l
         box-sizing border-box
       .singer-active  //分类标签活跃状态
         background $color-theme
         border-radius 5px
         color: $color-background;
         font-weight 700

         
</style>