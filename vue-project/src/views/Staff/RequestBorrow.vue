<template>
  <div class='container-fluid'>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col' colspan='5'>คำขอรายการยืม</th>
          </tr>
          <tr>
            <th scope='col'>ลำดับ</th>
            <th scope='col'>รายการ</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>S/N</th>
            <th scope='col'>สถานที่เก็บ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.item_code }}</td>
            <td>{{ item.serial }}</td>
            <td>{{ item.room }}</td>
          </tr>
          <tr>
            <td colspan='5'>
              <p>มีความประสงค์ยืม วัสดุ/ครุภัณฑ์ ของคณะ เพื่อ {{ reason }}</p>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan='3'>
              <button class='button is-success' type='submit'>อนุมัติรายการยืม</button>
            </td>
            <td colspan='2'>
              <button class='button is-danger' @click='cancelHandler'>ไม่อนุมัติรายการยืม</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  </div>
</template>
<script>
  import moment  from 'moment'
  import Swal from 'sweetalert2'
  import firestore from '../../../../firebase-config/vue/firebase';
  const line = require('../../../../line-config/config');

  export default {
    data() {
      return {
        userProfile: null,
        items: [],
        reason: null,
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished');
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
          })
          .catch((err) => {
            console.error(err);
          })
        } else {
          console.log('LIFF is not logged in');
          liff.login();
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err);
      });
    },
    created() {
      let obj = [];
      let arr = [];
      let m1 = moment();
      let m2 = moment();
      m1.startOf('day');
      m2.endOf('day');

      const docRef = firestore.collection('borrows');
      const query = docRef
        .where('created_at', '>=', m1.toDate())
        .where('created_at', '<=', m2.toDate())
      query
      .get()
      .then(snapshot =>{
        let index=1;
        snapshot.forEach((doc) => {
          for(let i=0; i < doc.data().items.length; i++){
            let data = doc.data().items[i];
            this.itemName(data.item_code, function(res) {
              if(res){
                obj = {
                  'id': index,
                  'name': res.name,
                  'item_code': data.item_code,
                  'serial': res.serial,
                  'room': data.room,
                }
                arr.push(obj);
                arr['reason'] = doc.data().reason;
                index++; 
              }
            });
          }
          this.items = arr;
        });
      })
      .catch(err =>{
        console.log(err);
      });
    },
    methods : {
      cancelHandler(){ // เมื่อคลิกปุ่ม ยกเลิก
        liff.closeWindow();
      },
      itemName(id, callback){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',id)
          .where('status','==','ถูกยืม')
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            callback({
              name: doc.data().name, 
              serial: doc.data().serial,
              brand: doc.data().brand
            })
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      async submitHandler(){
        if(this.items.length > 0){
          this.checkType((res) =>{
            if(res.type === '1'){
              this.queryDoc(obj);
            }else{
              this.requestBorrow(obj, function(res) {
                if(res === 'success'){
                  Swal.fire({
                    title: 'ยืมครุภัณฑ์',
                    text: 'ส่งคำขอรายการยืมครุภัณฑ์เรียบร้อยแล้วค่ะ',
                    icon: 'success'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      liff.sendMessages([
                        {
                          'type' : 'text',
                          'text' : 'ส่งคำขอยืมครุภัณฑ์'
                        }
                      ]).then(() => {
                        this.cancelHandler();
                      })
                    }
                  })
                }
              })
            }
          })          
        }else{
          Swal.fire({
            title: 'ผิดพลาด',
            text: 'กรุณาเพิ่มรายการครุภัณฑ์ก่อนค่ะ',
            icon: 'error'
          }).then((result) => {
            if (result.isConfirmed) {
              liff.closeWindow()
            }
          })
        }
      },
      checkType(callback){
        const docRef = firestore.collection('userRegister');
        const query = docRef
        .where('userid','==',this.userProfile)
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            if(doc.data().type === 'user'){
              callback({
                type: '0',
                uid: doc.data().userid
              });
            }else{
              callback({
                type: '1',
                uid: doc.data().userid
              });
            }
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      requestBorrow(req,res){
        const docRef = firestore.collection('requestBorrow');
        docRef.add(req)
        .then(()=>{
          res('success');
        })
        .catch(err => console.log(err));
      },
      queryDoc(data){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        for (let i = 0; i < this.items.length; i++) { // loop ทีละรายการ
          const docRef = firestore.collection('items');
          const query = docRef
            .where('item_code','==',this.items[i])
            .where('status','==','ใช้งาน')
          query
          .get()
          .then(snapshot =>{
            snapshot.forEach((doc) => {
              this.updateStatus(doc.id,this.room_at[i]) // หากพบข้อมูล เรียกฟังก์ชัน update ส่ง id กับสถานที่เก็บปัจจุบันไป
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
        this.addBorrow(data); // เมื่ออัพเดตข้อมูลในตาราง items แล้ว เพิ่มข้อมูลรายการยืมที่ตาราง borrows
      },
      updateStatus(id,room_at){ // อัพเดต สถานที่เก็บปัจจุบัน ในตาราง items
        const item = firestore.collection('items');
        const query = item.doc(id)
        query
        .update({status:'ถูกยืม',room:room_at})
        .then(()=>{
          console.log('Updated Success!!');
        })
        .catch(err =>{
          console.log(err);
        });
      },
      addBorrow(data){ // เพิ่มข้อมูลรายการยืมในตาราง borrows
        const borrow = firestore.collection('borrows');
        borrow.add(data)
        .then(()=>{
          Swal.fire({
            title: 'บันทึกข้อมูลสำเร็จ',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              liff.sendMessages([
                {
                  'type' : 'text',
                  'text' : 'อนุมัติรายการยืมเรียบร้อยแล้วค่ะ'
                }
              ]).then(() => {
                this.cancelHandler();
              })
            }
          })
        })
        .catch(err => console.log(err));
      }
    }
  }
</script>