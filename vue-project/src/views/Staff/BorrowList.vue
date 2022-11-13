<template>
  <div>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ลำดับที่</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>สถานที่เก็บ</th>
            <th scope='col'>ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item }}</td>
            <td>
              <ListRoom 
                :getAllRoom='getRoom'
                style='width:140px'/>
            </td>
            <td>
              <input 
                type='checkbox' 
                :id='key'
                :value='item'
                v-model='delItem'
                @change='deleteItem'>
            </td>
          </tr>
          <tr>
            <td colspan='4'>
              <b-field label='มีความประสงค์ยืม วัสดุ/ครุภัณฑ์ ของคณะ เพื่อ'>
                <b-input 
                  type='textarea'
                  v-model='reason' 
                  placeholder='กรุณาระบุเหตุผล'>
                </b-input>
              </b-field>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan='2'>
              <button class='button is-success' type='submit'>ยืนยันรายการยืม</button>
            </td>
            <td colspan='2'>
              <button class='button is-danger' @click='cancelHandler'>ยกเลิก</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  </div>
</template>
<script>
  import Swal from 'sweetalert2'
  import ListRoom from '../../components/ListRoom.vue';
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');

  export default {
    components: {
      ListRoom
    },
    data() {
      return {
        userProfile: null,
        items: [],
        delItem: [],
        room_at: [],
        reason: null,
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        // console.log('LIFF initialize finished');
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
          })
          .catch((err) => {
            console.error(err);
          })
        } else {
          // console.log('LIFF is not logged in');
          liff.login();
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err);
      });
    },
    created() {
      for (let i = 0; i < localStorage.length; i++) { // loop หาเลขครุภัณฑ์
        const key = localStorage.key(i);
        if(key.search('item:') >= 0){
          this.items.push(localStorage.getItem(key)); // push เลขครุภัณฑ์ใน items
        }
      }
    },
    methods : {
      getRoom(room){ // เลือกห้องที่เก็บปัจจุบัน
        this.room_at.push(room);
      },
      deleteItem(){ // เมื่อเลือก 'ลบ' ใน checkbok
        Swal.fire({
          title: 'เลขครุภัณฑ์: '+ this.delItem,
          text: 'ต้องการลบรายการใช่หรือไม่?',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          icon: 'question'
        }).then((result) => {
          if (result.isConfirmed) {
            let rm = 'item:' + this.delItem;
            localStorage.removeItem(rm);
            window.location.reload();
          }
        })
      },
      cancelHandler(callback){ // เมื่อคลิกปุ่ม ยกเลิก
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if(key.search('item:') >= 0){
            localStorage.removeItem(key);
          }
        }
        callback('success');
      },
      async submitHandler(){
        if(this.items.length > 0){
          let obj = {
            borrow_by:this.userProfile,
            reason: this.reason,
            created_at: new Date()
          };

          let item = []
          for (let i = 0; i < this.items.length; i++) { // loop add ข้อมูลรายการยืมลงใน data สำหรับไว้ add data ลงตาราง borrows
            item[i] = {
              'item_code':this.items[i],
              'room':this.room_at[i],
              'status':'0'
            }
          }

          obj['items'] = item

          this.checkType((res) =>{
            if(res.type === '1'){
              this.queryDoc(obj);
            }else{
              obj['status'] = '0'; // เช็ค status table request borrows
              this.requestBorrow(obj, function(res) {
                if(res === 'success'){
                  Swal.fire({
                    title: 'ยืมครุภัณฑ์',
                    text: 'ส่งคำขอรายการยืมครุภัณฑ์เรียบร้อยแล้วค่ะ',
                    icon: 'success'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.cancelHandler((res)=>{
                        console.log(res);
                        if(res==='success'){
                            liff.sendMessages([
                              {
                                'type' : 'text',
                                'text' : 'ส่งคำขอยืมครุภัณฑ์'
                              }
                            ])
                          liff.closeWindow();
                        }
                      });
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
              this.updateStatus(doc.id,this.room_at[i],i,(res)=>{
                if(res === 'success'){
                  this.addBorrow(data); // เมื่ออัพเดตข้อมูลในตาราง items แล้ว เพิ่มข้อมูลรายการยืมที่ตาราง borrows
                }
              }); // หากพบข้อมูล เรียกฟังก์ชัน update ส่ง id กับสถานที่เก็บปัจจุบันไป
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
      },
      updateStatus(id,room_at,i,callback){ // อัพเดต สถานที่เก็บปัจจุบัน ในตาราง items
        if(i < this.items.length){
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
        }else{
          callback('success');
        }
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
                  'text' : 'ยืมเรียบร้อยแล้วค่ะ'
                }
              ]).then(() => {
                this.cancelHandler((res)=>{
                  if(res === 'success'){
                    this.closeWindow();
                  }
                });
              })
            }
          })
        })
        .catch(err => console.log(err));
      }
    }
  }
</script>