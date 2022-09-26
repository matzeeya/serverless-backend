<template>
  <div id="ViewData">
  </div>
</template>
<script>
  const line = require('../../../line-config/config')

  export default {
    name: 'ViewData',
    data() {
      return {
        item_code: this.$route.params.code
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
    },
    created(){
      this.$axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + this.item_code)
      .then((doc) => {
        const item = doc.data[0];
        console.log(item.name);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
</script>