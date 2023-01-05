<template>
  <div>
    <p>กำลังบันทึกข้อมูล กรุณารอสักครู่...</p>
  </div>
</template>

<script lang="js">
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');
  
  export default {
    data() {
      return {
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
        // console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
            this.pushItem(); //Add data in DB
          })
          .catch((err) => {
            console.error(err)
          })
        } else {
          // console.log('LIFF is not logged in')
          liff.login()
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err)
      });
    },
    created(){ // เช็คเลขครุภัณฑ์ใน inventory nu
      axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + this.code)
      .then((doc) => {
        this.item = doc.data[0];
        this.room_db = doc.data[0].room;
      })
      .catch((err) => {
        Swal.fire({
          title: 'ไม่พบข้อมูล',
          text: 'ไม่พบข้อมูลหมายเลขครุภัณฑ์: '+ this.code +' ในระบบค่ะ',
          icon: 'error'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(err);
            liff.closeWindow()
          }
        })
      });
    },
    methods : {
      pushItem(){ // เพิ่ม field ลงใน data
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
        this.item.created_at = new Date();

        this.chkItem(this.item);        
      },
      chkItem(data){ // เช็คหมายเลขครุภัณฑ์ในฐานข้อมูล
        const docRef = firestore.collection('items')
        const query = docRef
          .where('item_code','==',this.code)
        query
        .get()
        .then(snapshot =>{
          console.log('snap ',snapshot)
          if(snapshot.empty){ // หากไม่พบ สามารถเพิ่มข้อมูลใหม่ได้
            this.addItem(data)
          }else{ // หากมีข้อมูลอยู่แล้ว ไม่สามารถเพิ่มข้อมูลได้
            snapshot.forEach((doc) => {
              Swal.fire({
                title: 'ไม่สามารถเพิ่มข้อมูลได้',
                text: 'เนื่องจากมีข้อมูลครุภัณฑ์: '+ doc.data().item_code +' ในระบบแล้วค่ะ',
                icon: 'error'
              }).then((result) => {
                if (result.isConfirmed) {
                  liff.closeWindow()
                }
              })
            });
          }
        })
        .catch(err =>{
          console.log(err)
        }); 
      },
      addItem(data){ // เพิ่มข้อมูลลงในฐานข้อมูล
        const item = firestore.collection('items');
        item.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              text: 'เพิ่มข้อมูลครุภัณฑ์: '+ this.code +' เรียบร้อยแล้วค่ะ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.sendMessages([
                  {
                    'type' : 'text',
                    'text' : 'เพิ่มข้อมูลครุภัณฑ์หมายเลข: ' + this.code
                  }
                ]).then(() => {
                  liff.closeWindow();
                })
              }
            })
          })
          .catch(err => console.log(err));
      }
    }
  }
</script>