<template>
<transition name="slide">
  <musicList :title='title' :bg-image='bgImg' :songs='songs' :rank="false"></musicList>
  <!-- <div class="singer-detail">
    {{this.singer}}
  </div> -->
</transition>
</template>
<script>
import {mapGetters} from 'vuex'
import musicList from 'components/music-list/music-list'


export default {
  name:'',
  data(){
    return {
      normalizeSongs: [],
      songs: []
    }
  },
  components: {
    musicList
  },
  computed: {
    title() {
      return this.singer.singer_name
    },
    bgImg() {
      return this.singer.singer_pic
    },
    ...mapGetters([
      'singer'
    ])
  },
  created() {
      this._getSingerAlbum()
  },
  methods: {
    // 获取歌手专辑
    async _getSingerAlbum() {
      // 用户页面刷新,参数消失时页面返回之前页面
      if(!this.singer.singer_mid) {
        this.$router.push('/singer')
        return
      }
       const res = await this.$http.get('/singer/album',{params:{singermid:this.singer.singer_mid}})
       this.normalizeSongs = res.data.data.list
       if(this.normalizeSongs){
         const res = await this.$http.get('/album/songs',{params:{albummid:this.normalizeSongs[this.normalizeSongs.length-3].album_mid}})
         this.songs = res.data.data.list
         console.log(res.data.data.list);
       }
   }
 }
}
</script>
<style scoped lang='stylus'>
@import "../../common/stylus/variable"

.singer-detail
  position fixed
  z-z-index 100
  top 0
  left  0
  right 0
  bottom 0
  background $color-background

.slide-enter-active, .slide-leave-active {
  transition: all .3s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform : translate3d(100%,0,0);
}
</style>