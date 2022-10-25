<template>
  <div></div>
</template>
<script>
const line = require('../../../../line-config/config')
export default {
  name:'CheckItem',
  mounted() {
    const liff = this.$liff
    liff.init({
      liffId: line.liffID
    }).then(() => {
      liff.scanCode().then(function (code){
        window.location.replace(line.liffUrl + '/addItem/' + code.value);
      });
    }).catch((err) => {
      console.error('Error initialize LIFF: ', err)
    });
  }
}
</script>