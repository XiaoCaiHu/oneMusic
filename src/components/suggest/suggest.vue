<template>
  <scroll class="suggest" 
          ref="suggest" 
          :pullup='pullup' 
          :data='result'
          :beforeScroll = 'beforeScroll'
          @scrollToEnd = 'searchMore'
          @beforeScroll = 'listScroll'
  >
    <ul class="suggest-list">
        <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
            <div class="icon">
                <i :class="getIconCls(item)"></i>
            </div>
            <div class="name">
                <p class="text">{{item.songname}}</p>
            </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉,暂无搜索"></no-result>
    </div>
  </scroll>
</template>
<script>
import scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapActions,mapMutations} from 'vuex'
import noResult from 'base/no-result/no-result'

export default {
  props: {
      query: {
          type: String,
          default: ''
      },
      showSinger: {
          type: Boolean,
          default: true
      }
  },
  name:'',
  data(){
    return {
       page: 1,
       result: [],
       pullup: true,
       beforeScroll: true, //判断是否开始滑动
       hasMore: true, //判断是否加载完
    }
  },
  components: {
    scroll,
    Loading,
    noResult
  },
  methods: {
    ...mapMutations({
      setCdImage:'SET_CDIMAGE'
    }),
    ...mapActions([
      'insertSong'
    ]),
    //   获取搜索列表
      async search(num) {
        const res = await this.$http.get('/search',{params:{key:this.query,t:7,pageNo:this.page}})
        if(res.status===200 && num===2) {
          this.hasMore = true
          this.result = this.result.concat(res.data.data.list) 
          this._checkMore(res.data.data)
          console.log(this.result);
        }else if(res.status===200) {
          this.hasMore = true
          this.result = res.data.data.list
          this._checkMore(res.data.data)
          console.log(this.result);
        }
      },
      // 
      refresh() {
        this.$refs.suggest.refresh()
      },
      // 列表样式 
      getIconCls(item) {
        if(item.t === 9) {
          return 'icon-mine'
        }else {
          return 'icon-music'
        }
      },
      // 加载更多数据
      searchMore() {
        if(!this.hasMore) {
          return
        }
        const num = 2
        this.page++
        this.search(num)
      },
      listScroll() {
        this.$emit('listScroll')
      },
      _checkMore(data) {
        const song = data
        if(!song.list.length || (song.list.length + song.pageNo * song.pageSize ) > song.total) {
          this.hasMore = false
        }
      },
      // 选择歌曲
      selectItem(item) {
        this.insertSong({
          song:item
          // list:index
        })
        this.$emit('select')
        // 播放器默认背景图
        this.setCdImage('http://p1.music.126.net/LpFu9pWQ3tzldjhkLwh4Vw==/109951165291444752.jpg?param=130y130')
      }
    
  },
  watch: {
      query() {
          this.search()
      }
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>