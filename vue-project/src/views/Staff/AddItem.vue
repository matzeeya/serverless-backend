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
            this.pushItem(); //Add data in DB
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
      chkItem(data){
        const docRef = firestore.collection('items')
        const query = docRef
          .where('item_code','==',this.code)
        query
        .get()
        .then(snapshot =>{
          console.log("snap "+snapshot.doc)
          snapshot.forEach((doc) => {
            console.log("data: "+ doc.data())
            if(doc.data()){
              console.log("T")
            }else{
              console.log("F")
            }
            Swal.fire({
              title: 'ไม่สามารถเพิ่มข้อมูลได้',
              text: 'เนื่องจากมีข้อมูลครุภัณฑ์: '+ this.code +' ในระบบแล้วค่ะ',
              icon: 'error'
            }).then((result) => {
              if (result.isConfirmed) {
                // console.log("items: "+ doc.id)
                liff.closeWindow()
              }
            })
          });
        })
        .catch(err =>{
          console.log("F")
          this.addItem(data)
          console.log(err)
        }); 
      },
      addItem(data){
        const item = firestore.collection('items');
        item.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              text: 'เพิ่มข้อมูลครุภัณฑ์: '+ this.code +' เรียบร้อยแล้วค่ะ',
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

        this.chkItem(this.item);        
      }
    }
  }
</script>