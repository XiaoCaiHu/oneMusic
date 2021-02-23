import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'

const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],  
    sequenceList: [],
    mode: playMode.sequence, 
    currentIndex: -1,  
    song: '',   //歌曲播放链接
    lyric: '',  //歌词
    disc: {},                       
    cdimage: {},                    //播放器背景图
    searchHistory: loadSearch(),   //搜索历史
    playHistory: loadPlay(),       //播放历史
    favoriteList: loadFavorite()  //收藏列表
}

export default state