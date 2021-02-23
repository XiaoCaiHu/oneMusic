// mixin 共享组件之间的js逻辑

import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
// 引入洗牌函数
import {shuffle} from 'common/js/util'
// 外派生命周期函数
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      setTimeout(() => {
        this.handlePlaylist(newVal)
      },200)
    }
  },
  methods: {
    // 
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
// 播放器共享状态
export const playerMixin = {
  computed: {
    // 播放模式
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'SET_PLAYING',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList',
      'NextPrev',
      'NextPrev2'  
    ]),
// 改变播放模式
    changMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      // 判断播放模式
      if(mode === playMode.random){
        // 当为随机播放时,打乱列表顺序
        list = shuffle(this.sequenceList)
      }else {
        // 不为随机播放时,将列表还原
        list = this.sequenceList
      }
      this.setPlayList(list)
      this.resetCurrentIndex(list)
    },
//  在列表中找到歌曲索引值,并播放
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.mid === this.currentSong.mid || item.songmid === this.currentSong.songmid
      })
      this.setCurrentIndex(index)
      console.log(index);
      this.NextPrev({
         list:this.playlist,
         index:index
       })
       this.NextPrev2({
         list:this.playlist,
         index:index
       })          
    },
// 点击添加喜爱/取消收藏
    toggleFavorite(song) {
      // 如果列表中存在当前点击歌曲取消收藏,反之收藏
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
// 获取喜爱图标
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
// 判断收藏列表中是否存在相同的歌曲
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        if(song.mid) {
          return song.mid === item.mid
        }else {
          return song.songmid === item.songmid
        }
      })
      return index > -1
    }
  }
}
// 搜索相关的mixin
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory' //搜索历史
    ])
  },
  methods: {
// 获取搜索框输入值
    onQueryChange(query) {
      this.query = query
    },
// 失去焦点时
    blurInput() {
      this.$refs.searchBox.blur()
    },
// 热词填进搜索框 
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
// 保存搜索历史
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
