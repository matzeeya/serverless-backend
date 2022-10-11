<template>
  <div class="card">
    <img :src="photo" class="card-img-top">
    <div class="card-body">
      <p class="card-text"><b>หมายเลขครุภัณฑ์:</b> {{ item.item_code }}</p>
      <p class="card-text"><b>ชื่อรายการ:</b> {{ item.name }}</p>
      <p class="card-text"><b>ประเภท:</b> {{ item.item_type }}</p>
      <p class="card-text"><b>ชนิด:</b> {{ item.kind }}</p>
      <p class="card-text"><b>ยี่ห้อ:</b> {{ item.brand }}</p>
      <p class="card-text"><b>โมเดล:</b> {{ item.model }}</p>
      <p class="card-text"><b>Serial:</b> {{ item.serial }}</p>
      <p class="card-text"><b>รับประกัน:</b> {{ item.warranty }}</p>
      <p class="card-text"><b>ระยะเวลาใช้งาน:</b> {{ item.length }}</p>
      <p class="card-text"><b>ราคา:</b> {{ item.price }} บาท</p>
      <p class="card-text"><b>จำนวน:</b> {{ item.unit }}</p>
      <p class="card-text"><b>องค์กร:</b> {{ item.organization }}</p>
      <p class="card-text"><b>สถานที่เก็บ:</b> {{ item.room }}</p>
      <p class="card-text"><b>สถานะ:</b> {{ item.status }}</p>
      <p class="card-text"><b>คุณลักษณะ:</b> {{ item.appearance }}</p>
      <p class="card-text"><b>ผู้รับผิดชอบ:</b> {{ item.holder }}</p>
      <p class="card-text"><b>อ้างอิง:</b> {{ item.reference }}</p>
      <br>
      <p class="card-text"><b>จัดซื้อจัดจ้าง</b></p>
      <p class="card-text"><b>กระบวนการ:</b> {{ item.procurement[0].method }}</p>
      <p class="card-text"><b>แหล่งที่มา:</b> {{ item.procurement[0].source }}</p>
      <p class="card-text"><b>ปีงบประมาณ:</b> {{ item.procurement[0].year }}</p>
      <p class="card-text"><b>ใบเบิก:</b> {{ item.procurement[0].docno_withdraw }}</p>
      <p class="card-text"><b>เซ็นรับ:</b> {{ item.procurement[0].owner_withdraw }}</p>
      <p class="card-text"><b>ใบสั่งซื้อ:</b> {{ item.procurement[0].contact_no }}</p>
      <p class="card-text"><b>วันที่สั่งซื้อ:</b> {{ item.procurement[0].contact_date }}</p>
      <p class="card-text"><b>วันที่รับเข้า:</b> {{ item.procurement[0].received_date }}</p>
      <p class="card-text"><b>ผู้ขาย:</b> {{ item.procurement[0].vender }}</p>
      <p class="card-text"><b>เลขที่ใบส่งของ:</b> {{ item.procurement[0].doc_invoice }}</p>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  const line = require('../../../line-config/config')
  export default {
    name: 'ViewData',
    data() {
      return {
        photo: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
        code: this.$route.params.code,
        item: []
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
      axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + this.code)
      .then((doc) => {
        this.item = doc.data[0];
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
</script>