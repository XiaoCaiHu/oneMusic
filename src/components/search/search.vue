<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox @query='onQueryChange' ref="searchBox"></searchBox>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay='refreshDelay' class="shortcut" ref="shortcut" :data='shortcut'>
        <div>
           <!-- 热门词汇 -->
           <div class="hot-key" >
             <h1 class="title">热门搜索</h1>
             <ul>
               <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                 <span>{{item.k}}</span>
               </li>
             </ul>
           </div>
           <!-- 搜索历史 -->
           <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <span class="text">搜索历史</span>
                <span class="clear" @click="showConfirm">
                  <i class="icon-clear"></i>
                </span>
              </h1>
              <!-- 搜索历史列表区 -->
              <searchList @select='addQuery' @delete='deleteSearchHistory' :searches="searchHistory"></searchList>
           </div>
        </div>
      </scroll>    
    </div>
    <div v-show="query" class="search-result">
      <!-- 搜索显示列表 -->
      <suggest ref="suggest" @select='saveSearch' @listScroll="blurInput" :query="query"></suggest>
    </div>
    <!-- 删除提示 -->
    <confirm :text="title" @cancel='cancel' @confirm="confirm" ref="confirm"></confirm>
  </div>
</template>
<script>
import scroll from 'base/scroll/scroll'
import searchBox from 'base/search-box/search-box'
import suggest from 'components/suggest/suggest'
import searchList from 'base/search-list/search-list'
import confirm from 'base/confirm/confirm'
import {playlistMixin,searchMixin} from 'common/js/mixin'
import {mapActions} from 'vuex'

export default {
  mixins: [playlistMixin,searchMixin],
  name:'',
  data(){
    return {
       hotKey: [],
       pageSize: 10,
       title:'确认清除全部搜索历史?'
    }
  },
  created() {
    this._getHotKey()
  },
  computed: {
    // 返回hotKey 与 searchHistory
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  components: {
    searchBox,
    suggest,
    searchList,
    confirm,
    scroll
  },
  methods: {
    ...mapActions([
      'clearSearchHistory'
    ]),
    // 当底部播放器出现或消失的操作
     handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0px'
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.suggest.$el.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    // 获取热搜词
    async _getHotKey() {
      const res = await this.$http.get('/search/hot')
      if(res.data.result === 100) {
        this.hotKey = res.data.data.slice(0,9)
        console.log(this.hotKey);
      }
    },
    // 显示确认弹窗/清空搜索历史
    showConfirm() {
      this.$refs.confirm.show()
      
    },
    // 取消清空
    cancel() {
      return
    },
    // 清空搜索历史列表
    confirm() {
      // 清空历史
      this.clearSearchHistory()
    }
  },
  watch: {
    query(newQuery) {
      // 没有搜索时,刷新shortcut组件
      if(!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        },20)
      }
    }
  }
}
</script>
<style scoped lang='stylus'>
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>