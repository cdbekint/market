<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script  type="text/ecmascript-6">
import vheader from '@/components/Header'
export default {
  name: 'app',
  data () {
    return {
      title: 'hello'
    }
  },
  components: { vheader },
  created () {
    this.$store.state.token =window.localStorage["token"]||this.util.getCookie("token");
    if (this.$store.state.token == '' || this.$store.state.token == void 0 || window.localStorage['ownId'] == undefined) {
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>

<style lang='stylus' rel="stylesheet/stylus">

</style>
