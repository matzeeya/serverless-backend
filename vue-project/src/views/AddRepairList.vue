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
    created() { // ค้นเลขครุภัณฑ์ในฐานข้อมูล
      const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',this.code)
          .where('status','in',['ชำรุด','ใช้งาน'])
        query
        .get()
        .then(snapshot =>{
          if(!snapshot.empty){ // หากพบข้อมูลและ status = 'ชำรุด','ใช้งาน' สามารถแจ้งซ่อมได้
            snapshot.forEach((doc) => {
              Swal.fire({
                title: 'เพิ่มรายการสำเร็จ',
                text: 'เพิ่มรายการแจ้งซ่อมครุภัณฑ์: '+ doc.data().item_code +' เรียบร้อยแล้วค่ะ',
                icon: 'success'
              }).then((result) => {
                if (result.isConfirmed) {
                  liff.sendMessages([
                    {
                      'type' : 'text',
                      'text' : 'เพิ่มรายการแจ้งซ่อมเรียบร้อยแล้วค่ะ'
                    }
                  ]).then(() => {
                    this.isSuccessType = 'is-success'
                    this.isSuccessMsg = 'เพิ่มรายการแจ้งซ่อมครุภัณฑ์: ' + doc.data().item_code
                    localStorage.setItem('item:'+this.code, this.code);
                    liff.closeWindow()
                  })
                }
              })
            });
          }else{ // หากไม่พบข้อมูลหรือ status != 'ชำรุด','ใช้งาน' ไม่สามารถแจ้งซ่อมได้
            Swal.fire({
              title: 'ไม่สามารถเพิ่มข้อมูลได้',
              text: 'เนื่องจากไม่มีข้อมูลครุภัณฑ์: '+ this.code +' ในระบบค่ะ',
              icon: 'error'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.sendMessages([
                  {
                    'type' : 'text',
                    'text' : 'ไม่สามารถเพิ่มรายการแจ้งซ่อมได้ค่ะ'
                  }
                ]).then(() => {
                  this.isSuccessType = 'is-danger'
                  this.isSuccessMsg = 'ไม่สามารถเพิ่มรายการแจ้งซ่อมครุภัณฑ์: ' + this.code +' ได้ กรุณาตรวจสอบสถานะครุภัณฑ์อีกครั้ง'
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
</script>