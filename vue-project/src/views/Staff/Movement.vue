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
      <p class="card-text"><b>องค์กร:</b> {{ item.organization }}</p>
      <p class="card-text"><b>สถานที่เก็บ:</b> {{ item.room }}</p>
      <p class="card-text"><b>สถานะ:</b> {{ item.status }}</p>
      <p class="card-text"><b>คุณลักษณะ:</b> {{ item.appearance }}</p>
      <p class="card-text"><b>ผู้รับผิดชอบ:</b> {{ item.holder }}</p>
      <form @submit.prevent="submitHandler">
        <ListRoom :getAllRoom="getRoom"/>
        <div class="buttons">
          <button class="button is-info"
            type="submit">แก้ไขรายการ</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  // const line = require('../../../../line-config/config')
  import ListRoom from '../../components/ListRoom.vue'
  export default {
    components: {
      ListRoom
    },
    data() {
      return {
        photo: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
        code: this.$route.params.code,
        item: [],
        room_at:null
      }
    },
    created(){
      axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + this.code)
      .then((doc) => {
        this.item = doc.data[0];
      })
      .catch((err) => {
        console.log(err);
      });
    },
    methods : {
      getRoom(room){
        this.room_at = room
      },
      addMovement(obj){
        const movement = firestore.collection("movement");
        movement.add(obj)
          .then(()=>{
            Swal.fire({
              title: 'แก้ไขข้อมูลสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.closeWindow()
              }
            })
          })
          .catch(err => console.log(err));
      },
      async submitHandler(){
        const obj = {
          room_old:this.room_db,
          room_new:this.room_at,
          item_code:this.item_code,
          created_at:Date.now()
        };
        this.addMovement(obj);
      }
    }
  }
</script>