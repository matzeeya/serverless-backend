<template>
  <div></div>
</template>
<script>
const line = require('../../../../line-config/config')
export default {
  name:'SellItem',
  mounted() {
    const liff = this.$liff
    liff.init({
      liffId: line.liffID
    }).then(() => {
      liff.scanCode().then(function (code){
        liff.sendMessages([
          {
            "type" : "text",
            "text" : "จำหน่ายครุภัณฑ์: " + code.value
          }
        ]).then(function (){
          liff.closeWindow();
        })
      });
    }).catch((err) => {
      console.error('Error initialize LIFF: ', err)
    });
  }
}
</script>