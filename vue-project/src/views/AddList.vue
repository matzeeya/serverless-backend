<template>
  <div>
    <p>เพิ่มรายการยืมครุภัณฑ์: {{ code }}</p>
  </div>
</template>
<script>
  const line = require('../../../line-config/config')
  export default {
    data() {
      return {
        photo: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
        code: this.$route.params.code,
        userProfile: null
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
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
    },
    created() {
      localStorage.setItem("item:"+this.code, this.code);
      liff.closeWindow()
    }
  }
</script>