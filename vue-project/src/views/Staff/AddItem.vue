<template>
  <div>
    <p>กำลังบันทึกข้อมูล กรุณารอสักครู่...</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');
  
  export default {
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
            this.userProfile = profile.userId;
            this.pushItem();
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
      })
      .catch((err) => {
        console.log(err);
      });
    },
    methods : {
      addItem(data){
        const item = firestore.collection('items');
        item.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.closeWindow()
              }
            })
          })
          .catch(err => console.log(err));
      },
      pushItem(){
        const search = this.room_db.search('ห้อง');
        if(search >= 0){
          const splitRoom = this.room_db.split('ห้อง ');
          this.room_old = splitRoom[1];
        }else{
          this.room_old = this.room_db;
        }
        //Add All data to table items
        this.item.room = this.room_old;
        this.item.room_db = this.room_db;
        this.item.room_old = this.room_old;
        this.item.create_by = this.userProfile;
        this.item.created_at = new Date().toLocaleString();
        this.addItem(this.item);
      }
    }
  }
</script>