<template>
  <div></div>
</template>
<script>
const line = require('../../../../line-config/config')
export default {
  name:'RepairItem',
  mounted() {
    const liff = this.$liff
    liff.init({
      liffId: line.liffID
    }).then(() => {
      liff.scanCode().then(function (code){
        liff.sendMessages([
          {
            "type" : "text",
            "text" : "แจ้งซ่อมครุภัณฑ์: " + code.value
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