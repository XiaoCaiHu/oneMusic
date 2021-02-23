
import * as types from './mutations-types'
import axios from '../axios'
import {playMode} from 'common/js/config'
import { shuffle } from 'common/js/util'
import {saveSearch,savePlay,deleteSearch,clearSearch,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    if(item.id) {
      return item.mid === song.mid
    }else {
      return item.songmid === song.songmid
    }
    
  })
}

export const selectPlay = async function({commit,state},{list,index}) {
    // 获取歌曲,写在这里防止踩坑
  const {data:res} = await axios.get('/song/urls',{params:{id:list[index].mid}})
  const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:list[index].mid}})
  // console.log(lyricRes);
//   console.log(res);
  if(res.result===100 && lyricRes.result===100) {
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAYLIST,list)
    commit(types.SET_CURRENT_INDEX,index)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING,true) 
    commit(types.SET_SONG,res.data)
    commit(types.SET_LYRIC,lyricRes.data)
  }
}
// 点击换歌,问就是之前搞得坑
export const NextPrev = async function({commit},{list,index}) {
    // console.log(state.playlist[index].mid);
    const {data:res} = await axios.get('/song/urls',{params:{id:list[index].mid}})
    const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:list[index].mid}})
    console.log('---------------');
    // console.log(res);  
    if(res.result===100 && lyricRes.result===100) {
      console.log('---------------');
      commit(types.SET_SONG,res.data)
      commit(types.SET_LYRIC,lyricRes.data)
    }
}
// 随机播放
export const randomPlay = async function ({commit},{list,index}) {
  
  let randomList = shuffle(list)
  // 获取歌曲,写在这里防止踩坑
  const {data:res} = await axios.get('/song/urls',{params:{id:randomList[index].mid}})
  const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:randomList[index].mid}})
  if(res.result===100 && lyricRes.result===100) {
    commit(types.SET_PLAY_MODE,playMode.random)
    commit(types.SET_SEQUENCE_LIST,list)
    commit(types.SET_PLAYLIST,randomList)
    commit(types.SET_CURRENT_INDEX,0)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING,true) 
    commit(types.SET_SONG,res.data)
    commit(types.SET_LYRIC,lyricRes.data)
  }
}

// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
export const selectPlay2 = async function({commit,state},{list,index}) {
  // 获取歌曲,写在这里防止踩坑
const {data:res} = await axios.get('/song/urls',{params:{id:list[index].songmid}})
const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:list[index].songmid}})
// console.log(lyricRes);
// console.log('dkoasjdosapj');
//   console.log(res);
if(res.result===100 && lyricRes.result===100) {
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYLIST,list)
  commit(types.SET_CURRENT_INDEX,index)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true) 
  commit(types.SET_SONG,res.data)
  commit(types.SET_LYRIC,lyricRes.data)
}
}
// 点击换歌,问就是之前搞得坑
export const NextPrev2 = async function({commit},{list,index}) {
  // console.log(state.playlist[index].mid);
  const {data:res} = await axios.get('/song/urls',{params:{id:list[index].songmid}})
  const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:list[index].songmid}})
  // console.log(res);  
  if(res.result===100 && lyricRes.result===100) {
    commit(types.SET_SONG,res.data)
    commit(types.SET_LYRIC,lyricRes.data)
  }
}
// 随机播放
export const randomPlay2 = async function ({commit},{list,index}) {

let randomList = shuffle(list)
// 获取歌曲,写在这里防止踩坑
const {data:res} = await axios.get('/song/urls',{params:{id:randomList[index].songmid}})
const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:randomList[index].songmid}})
if(res.result===100 && lyricRes.result===100) {
  commit(types.SET_PLAY_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYLIST,randomList)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN,true)
  commit(types.SET_PLAYING,true) 
  commit(types.SET_SONG,res.data)
  commit(types.SET_LYRIC,lyricRes.data)
}
}

// 点击换歌,问就是之前搞得坑(点击列表换歌)
export const SWITCHSONG = async function({commit},{item}) {
  // console.log(state.playlist[index].mid);
  if(item.mid) {
    const {data:res} = await axios.get('/song/urls',{params:{id:item.mid}})
    const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:item.mid}})

    if(res.result===100 && lyricRes.result===100) {
      commit(types.SET_SONG,res.data)
      commit(types.SET_LYRIC,lyricRes.data)
    }
  }else {
    const {data:res} = await axios.get('/song/urls',{params:{id:item.songmid}})
    const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:item.songmid}})  

    if(res.result===100 && lyricRes.result===100) {
      commit(types.SET_SONG,res.data)
      commit(types.SET_LYRIC,lyricRes.data)
    }
  } 
}

// 添加歌曲
export const insertSong = async function({commit,state},{song}) {

  // song.title = song.songname

  // console.log(song.title);


  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲,并返回其索引
  let fpIndex = findIndex(playlist,song)
  // 因为是插入歌曲,所以索引要+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex,0,song)
  // 如果已经包含了这首歌
  if(fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if(currentIndex > fpIndex) {
      playlist.splice(fpIndex,1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1,1)
    }
  }

  let currentSIndex = findIndex(sequenceList,currentSong) + 1

  let fsIndex = findIndex(sequenceList,song)

  sequenceList.splice(currentSIndex,0,song)

  if(fsIndex > -1) {
    if(currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex,1)
    } else {
      sequenceList.splice(fpIndex + 1,1)
    }
  }
  // console.log(song[index]);
  console.log(typeof(song));

  if(song.songmid) {
     
    const {data:res} = await axios.get('/song/urls',{params:{id:song.songmid}})
    const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:song.songmid}})
  
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING,true) 
    commit(types.SET_SONG,res.data)
    commit(types.SET_LYRIC,lyricRes.data)

  }else {
    const {data:res} = await axios.get('/song/urls',{params:{id:song.mid}})
    const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:song.mid}})
  
    commit(types.SET_PLAYLIST,playlist)
    commit(types.SET_SEQUENCE_LIST,sequenceList)
    commit(types.SET_CURRENT_INDEX,currentIndex)
    commit(types.SET_FULL_SCREEN,true)
    commit(types.SET_PLAYING,true) 
    commit(types.SET_SONG,res.data)
    commit(types.SET_LYRIC,lyricRes.data)     
  }
}

// 保存搜索历史
export const saveSearchHistory = function({commit},query) {
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

// 保存播放历史
export const savePlayHistory = function ({commit},song) {
  commit(types.SET_PLAY_HISTORY,savePlay(song))
}

//删除搜索历史
export const  deleteSearchHistory = function({commit},query) {
  commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

//清空搜索历史
export const  clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY,clearSearch())
}

// 删除歌曲
export const deleteSong = async function({commit,state},song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  // 找到歌曲在playlist列表位置
  let pIndex = findIndex(playlist,song)
  // 删除对应歌曲
  playlist.splice(pIndex,1)
  // 找到歌曲在sequenceList列表位置
  let sIndex = findIndex(sequenceList,song)
  // 删除对歌曲
  sequenceList.splice(sIndex,1)
  //如果当{前删除的歌曲} 在 {播放歌曲} 前面,则当前播放的歌曲顺序需要减1 
  if(currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)

  // 删除完列表后,playing(是否打开播放器) 设为false
  if(playlist.length === 0) {
    commit(types.SET_PLAYING,false) 
    commit(types.SET_SONG,null)
    commit(types.SET_LYRIC,null)
    console.log('歌都被你抛弃了');
  }else {
    commit(types.SET_PLAYING,true) 
    if(song.mid) {

      const {data:res} = await axios.get('/song/urls',{params:{id:sequenceList[currentIndex].mid}})
      const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:sequenceList[currentIndex].mid}})
  
      if(res.result===100 && lyricRes.result===100) {
        commit(types.SET_SONG,res.data)
        commit(types.SET_LYRIC,lyricRes.data)
      }
    }else {

      const {data:res} = await axios.get('/song/urls',{params:{id:sequenceList[currentIndex].songmid}})
      const {data:lyricRes} = await axios.get('/lyric',{params:{songmid:sequenceList[currentIndex].songmid}})  
  
      if(res.result===100 && lyricRes.result===100) {
        commit(types.SET_SONG,res.data)
        commit(types.SET_LYRIC,lyricRes.data)
      }
    }
  }
}

// 清空播放列表
export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST,[])
  commit(types.SET_SEQUENCE_LIST,[])
  commit(types.SET_CURRENT_INDEX,-1)
  commit(types.SET_PLAYING,false)
  commit(types.SET_SONG,null)
  commit(types.SET_LYRIC,null)
}

// 保存喜爱列表
export const saveFavoriteList = function({commit},song) {
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

// 取消保存喜爱列表
export const deleteFavoriteList = function({commit},song) {
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}

