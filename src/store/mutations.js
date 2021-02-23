// 修改状态
import * as types from './mutations-types'
import {createLrcObj} from 'common/js/lrc'

const mutations = {
    [types.SET_CDIMAGE](state,cdimage){
            state.cdimage = cdimage
    },
    [types.SET_SINGER](state,singer){
        state.singer = singer
    },
    [types.SET_DISC](state,disc){
        state.disc = disc
    },
    [types.SET_PLAYING](state,flag){
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state,flag){
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state,list){
        state.playlist = list
    },
    [types.SET_SEQUENCE_LIST](state,list){
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state,mode){
        state.mode = mode
    },
    [types.SET_CURRENT_INDEX](state,index){
        state.currentIndex = index
    },
    [types.SET_SONG](state,res){
        if(res) {
            for(let k in res){
                state.song = res[k]
            }
        }else {
            state.song = null
        }
        
    },
    [types.SET_LYRIC](state,lyricRes){
        if(lyricRes) {
            state.lyric = createLrcObj(lyricRes.lyric)
        }else{
            state.lyric = null
        }
        
        console.log(createLrcObj(lyricRes.lyric))
    },
    [types.SET_SEARCH_HISTORY](state,query){
        state.searchHistory = query
    },
    [types.SET_PLAY_HISTORY](state,song){
        state.playHistory = song
    },
    [types.SET_FAVORITE_LIST](state,list){
        state.favoriteList = list
    },
    
}

export default mutations

