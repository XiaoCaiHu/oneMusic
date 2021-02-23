<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 保持值前页面数据 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import tab from 'components/tab/tab'
import player from 'components/player/player'

export default {
  name:'app',
  data(){
    return {
       
    }
  },
  components: {
    MHeader,
    tab,
    player
  }
}
</script>

<style scoped lang="stylus">
  @import "./common/stylus/variable.styl"

    
</style>
