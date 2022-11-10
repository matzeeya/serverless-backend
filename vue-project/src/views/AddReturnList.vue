<template>
  <div>
    <b-field 
      v-model='lblResult'
      v-bind:type='isSuccessType'
      v-bind:label='isSuccessMsg'>
    </b-field>
  </div>
</template>
<script>
  import Swal from 'sweetalert2';
  import firestore from '../../../firebase-config/vue/firebase';
  
  const line = require('../../../line-config/config');

  export default {
    data() {
      return {
        code: this.$route.params.code,
        userProfile: null,
        lblResult:null,
        isSuccessType:null,
        isSuccessMsg:null
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        // console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
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
    created() { // ค้นข้อมูลในตาราง items เพื่อเอาสถานที่เก็บปัจจุบัน
      const docRef = firestore.collection('items');
      const query = docRef
        .where('item_code','==',this.code)
        .where('status','==','ถูกยืม')
      query
      .get()
      .then(snapshot =>{
        if(!snapshot.empty){ // หากพบข้อมูลและ status = 'ถูกยืม' สามารถคืนได้
          snapshot.forEach((doc) => {
            // console.log("items: "+ doc.id);
            this.addList(doc.data().room);
          });
        }else{ // หากไม่พบข้อมูลหรือ status != 'ถูกยืม' ไม่สามารถคืนได้
          Swal.fire({
            title: 'ไม่สามารถคืนได้',
            text: 'ไม่พบข้อมูลครุภัณฑ์: '+ this.code +' ในรายการยืมค่ะ',
            icon: 'error'
          }).then((result) => {
            if (result.isConfirmed) {
              this.isSuccessType = 'is-danger'
              this.isSuccessMsg = 'ไม่พบข้อมูลครุภัณฑ์: ' + this.code +' ในรายการยืมค่ะ'
              liff.closeWindow()
            }
          })
        }
      })
      .catch(err =>{
        console.log(err);
      }); 
    },
    methods:{
      addList(room){ // ค้นข้อมูลในตาราง borrows เพื่อคืนครุภัณฑ์
        const docRef = firestore.collection('borrows');
        const query = docRef
          .where('items','array-contains',{
            'item_code': this.code,
            'room': room,
            'status': '0'
          });
        query
        .get()
        .then(snapshot =>{
          if(!snapshot.empty){ // หากพบข้อมูลสามารถคืนได้
            snapshot.forEach((doc) => {
              console.log("borrow: "+ doc.id);
              Swal.fire({
                title: 'เพิ่มรายการสำเร็จ',
                text: 'เพิ่มรายการคืนครุภัณฑ์: '+ this.code +' เรียบร้อยแล้วค่ะ',
                icon: 'success'
              }).then((result) => {
                if (result.isConfirmed) {
                  liff.sendMessages([
                    {
                      'type' : 'text',
                      'text' : 'เพิ่มรายการคืนเรียบร้อยแล้วค่ะ'
                    }
                  ]).then(() => {
                    this.isSuccessType = 'is-success'
                    this.isSuccessMsg = 'เพิ่มรายการคืนครุภัณฑ์: ' + this.code
                    localStorage.setItem("item:"+this.code, this.code);
                    liff.closeWindow()
                  })
                }
              })
            });
          }else{ // หากไม่พบข้อมูลไม่สามารถคืนได้
            Swal.fire({
            title: 'ไม่สามารถเพิ่มข้อมูลได้',
            text: 'ไม่พบข้อมูลครุภัณฑ์: '+ this.code +' ในรายการยืมค่ะ',
            icon: 'error'
          }).then((result) => {
            if (result.isConfirmed) {
              liff.sendMessages([
                {
                  'type' : 'text',
                  'text' : 'ไม่สามารถเพิ่มรายการคืนได้ค่ะ'
                }
              ]).then(() => {
                this.isSuccessType = 'is-danger'
                this.isSuccessMsg = 'ไม่สามารถเพิ่มรายการคืนครุภัณฑ์: ' + this.code +' ได้ กรุณาตรวจสอบสถานะครุภัณฑ์อีกครั้ง'
                liff.closeWindow()
              })
              
            }
          })
          }
        })
        .catch(err =>{
          console.log(err);
        }); 
      }
    }
  }
</script>