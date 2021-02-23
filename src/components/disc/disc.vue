<template>
  <transition name="slide">
    <music-list2 :title="title" :bg-image="bgImage" :songs="songs" :rank="false"></music-list2>
  </transition>
</template>
<script>
import MusicList2 from 'components/music-list/music-list2'
import {mapGetters} from 'vuex'

export default {
  name:'',
  data(){
    return {
       songs: []
    }
  },
  components: {
      MusicList2,
  },
  computed: {
      ...mapGetters([
          'disc'
      ]),
      title() {
          return this.disc.title
      },
      bgImage() {
          return this.disc.cover_url_big
      }
  },
  created() {
     this._getSongDisc()
  },
  methods: {
      async _getSongDisc() {
        //   如果刷新无数据,返回之前页面
        if(!this.disc.tid) {
            this.$router.push('/recommend')
            return
        }
          console.log(this.disc.tid);
         const res = await this.$http.get('/songlist',{params:{id:this.disc.tid}})
         this.songs = res.data.data.songlist
         console.log(this.songs);
      }
  }
}
</script>
<style scoped lang='stylus'>
  .slide-enter-active, .slide-leave-active
      transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>