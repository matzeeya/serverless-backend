<template>
  <div class='card'>
    <img :src='photo' class='card-img-top'>
    <div class='card-body'>
      <p class='card-text'><b>หมายเลขครุภัณฑ์:</b> {{ item.item_code }}</p>
      <p class='card-text'><b>ชื่อรายการ:</b> {{ item.name }}</p>
      <p class='card-text'><b>ประเภท:</b> {{ item.item_type }}</p>
      <p class='card-text'><b>ชนิด:</b> {{ item.kind }}</p>
      <p class='card-text'><b>ยี่ห้อ:</b> {{ item.brand }}</p>
      <p class='card-text'><b>โมเดล:</b> {{ item.model }}</p>
      <p class='card-text'><b>Serial:</b> {{ item.serial }}</p>
      <p class='card-text'><b>องค์กร:</b> {{ item.organization }}</p>
      <p class='card-text'><b>สถานที่เก็บ:</b> {{ item.room }}</p>
      <p class='card-text'><b>สถานะ:</b> {{ item.status }}</p>
      <p class='card-text'><b>คุณลักษณะ:</b> {{ item.appearance }}</p>
      <p class='card-text'><b>ผู้รับผิดชอบ:</b> {{ item.holder }}</p>
      <form @submit.prevent='submitHandler'>
        <p class='card-text'><b>สถานที่เก็บปัจจุบัน:</b> <ListRoom :getAllRoom='getRoom'/></p>
        <button class='button is-info' type='submit'>แก้ไขรายการ</button>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';

  import firestore from '../../../../firebase-config/vue/firebase';
  import ListRoom from '../../components/ListRoom.vue';

  const line = require('../../../../line-config/config');

  export default {
    components: {
      ListRoom
    },
    data() {
      return {
        photo: 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
        code: this.$route.params.code,
        userProfile: null,
        item: [],
        item_code: null,
        room_db: null,
        room_old: null,
        room_at: null
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
            this.userProfile = profile.userId
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
        this.room_db = doc.data[0].room;
        this.item_code = doc.data[0].item_code;
      })
      .catch((err) => {
        console.log(err);
      });
    },
    methods : {
      getRoom(room){
        this.room_at = room
      },
      addItem(data){
        const item = firestore.collection('items');
        item.add(data)
          .then(()=>{
            console.log('บันทึกข้อมูลสำเร็จ');
          })
          .catch(err => console.log(err));
      },
      addMovement(obj){
        const movement = firestore.collection('movement');
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
        const search = this.room_db.search('ห้อง');
        if(search >= 0){
          const splitRoom = this.room_db.split('ห้อง ');
          this.room_old = splitRoom[1];
        }else{
          this.room_old = this.room_db;
        }
        //Add All data to table items
        this.item.room = this.room_at; //current room
        this.item.room_db = this.item.room; // room in inventory or db
        this.item.room_old = this.room_old; //old room
        this.item.create_by = this.userProfile;
        this.item.created_at = new Date().toLocaleString();
        this.addItem(this.item);
        
        //Add data to table movement
        const obj = {
          room_old: this.room_old,
          room_new: this.room_at,
          item_code: this.item_code,
          update_by: this.userProfile,
          created_at: new Date().toLocaleString()
        };
        this.addMovement(obj);
      }
    }
  }
</script>