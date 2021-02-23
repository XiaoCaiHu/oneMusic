import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15 //最大存储数据
//  
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200  //最大保存歌曲数量

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200


// 插入数组compare:比较函数 maxLen:最大值
    function insertArray(arr, val, compare, maxLen) {
      // 定义索引(返回匹配值的位置)
      const index = arr.findIndex(compare)
      // 第一条数据时
      if (index === 0) {
        return
      }
      // 数组中有此数据，并且不在第一个位置
      if (index > 0) {
        // 删除
        arr.splice(index, 1)
      }
      // 插入到第一个
      arr.unshift(val)
      // 如果有数组长度限制,则删除最后一个数组
      if (maxLen && arr.length > maxLen) {
        arr.pop()
      }
    }

// 删除函数
    function deleteFromArray(arr, compare) {
      // 找到相同值,删掉
      const index = arr.findIndex(compare)
      if (index > -1) {
        arr.splice(index, 1)
      }
    }

// 保存搜索结果
    export function saveSearch(query) {
      let searches = storage.get(SEARCH_KEY, [])
      // 每次插入到数组前,达到最大值删除最后一个
      insertArray(searches, query, (item) => {
        return item === query //返回数组中与query相同的值
      }, SEARCH_MAX_LEN)
      // 将searches保存到本地数据中
      storage.set(SEARCH_KEY, searches)
      return searches
    }

// 删除搜索历史
    export function deleteSearch(query) {
      let searches = storage.get(SEARCH_KEY, [])
      deleteFromArray(searches, (item) => {
        return item === query
      })
      storage.set(SEARCH_KEY, searches)
      return searches
    }

// 清空搜索历史
    export function clearSearch() {
      storage.remove(SEARCH_KEY)
      return []
    }

// 读取本地search列表
    export function loadSearch() {
      return storage.get(SEARCH_KEY, [])
    }

// 保存已播放歌曲
    export function savePlay(song) {
      let songs = storage.get(PLAY_KEY, [])
      // 每次插入到数组前,达到最大值删除最后一个
      insertArray(songs, song, (item) => {
        if(song.mid) {
          return song.mid === item.mid
        }else {
          return song.songmid === item.songmid
        }
      }, PLAY_MAX_LEN)
      // 将已播放歌曲保存到本地数据中
      storage.set(PLAY_KEY, songs)
      return songs
    }

// 读取已播放歌曲
    export function loadPlay() {
      return storage.get(PLAY_KEY, [])
    }

    export function saveFavorite(song) {
      let songs = storage.get(FAVORITE_KEY, [])
      insertArray(songs, song, (item) => {
        if(song.mid) {
          return song.mid === item.mid
        }else {
          return song.songmid === item.songmid
        }
      }, FAVORITE_MAX_LEN)
      storage.set(FAVORITE_KEY, songs)
      return songs
    }
    //  
    export function deleteFavorite(song) {
      let songs = storage.get(FAVORITE_KEY, [])
      deleteFromArray(songs, (item) => {
        if(song.mid) {
          return song.mid === item.mid
        }else {
          return song.songmid === item.songmid
        }
      })
      storage.set(FAVORITE_KEY, songs)
      return songs
    }

    export function loadFavorite() {
      return storage.get(FAVORITE_KEY, [])
    }

