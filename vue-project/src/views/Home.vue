<template>
  <div id="app">
    <h3 class="subtitle" v-if="userProfile">สวัสดีคุณ {{ userProfile.displayName }} ยินดีต้อนรับเข้าสู่ระบบ กรุณารอสักครู่นะคะ... 😀</h3>
    <h3 class="subtitle" v-else>สวัสดีค่ะ กรุณา Login ก่อนนะคะ 😀</h3>
  </div>
</template>
<script>
  const line = require('../../../line-config/config')
  export default {
    name: 'App',
    data() {
      return {
        userProfile: null
      }
    },
    mounted() {
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            // console.log(JSON.stringify(profile))
            this.userProfile = profile
          })
          .catch((err) => {
            console.error(err)
          })
        } else {
          console.log('LIFF is not logged in')
          liff.login()
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err)
      });
    }
  }
</script>