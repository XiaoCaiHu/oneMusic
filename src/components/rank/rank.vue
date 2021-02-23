<template>
  <transition name="slide">
    <music-list v-show="songs" :title="title" :bg-image="bgImage" :songs="songs" :rank="true"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list'

export default {
  name:'',
  data(){
    return {
       songs: [],
       topRes: []
    }
  },
  components: {
    MusicList
  },
  created() {
    this._getTopCategory()
  },
  computed: {
    title() {
      return this.topRes.data.data.info.title
    },
    bgImage() {
      return this.topRes.data.data.info.picUrl
    }
  },
  methods: {
    async _getTopCategory() {
      const res = await this.$http.get('/top')
      
      this.songs = res.data.data.list
      console.log(this.songs);
      this.topRes = res
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