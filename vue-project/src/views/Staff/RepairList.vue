<template>
  <div>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ลำดับที่</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>สถานที่เก็บ</th>
            <th scope='col'>อาการเสีย</th>
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
              <b-input 
                type='text'
                v-model='reason[index]'>
              </b-input>
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
        </tbody>
        <tfoot>
          <tr>
            <td colspan='3'>
              <button class='button is-success' type='submit'>ยืนยันรายการแจ้งซ่อม</button>
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
        reason: []
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
      cancelHandler(){ // เมื่อคลิกปุ่ม ยกเลิก
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if(key.search('item:') >= 0){
            localStorage.removeItem(key);
          }
        }
        liff.closeWindow();
      },
      queryDoc(data){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        for (let i = 0; i < this.items.length; i++) { // loop ทีละรายการ
          const docRef = firestore.collection('items');
          const query = docRef
            .where('item_code','==',this.items[i])
            .where('status','in',['ชำรุด','ใช้งาน'])
          query
          .get()
          .then(snapshot =>{
            snapshot.forEach((doc) => {
              // console.log(doc.id);
              this.updateStatus(doc.id,this.room_at[i]) // หากพบข้อมูล เรียกฟังก์ชัน update ส่ง id กับสถานที่เก็บปัจจุบันไป
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
        this.addRepair(data); // เมื่ออัพเดตข้อมูลในตาราง items แล้ว เพิ่มข้อมูลรายการแจ้งซ่อมที่ตาราง repairs
      },
      updateStatus(id,room_at){ // อัพเดต สถานที่เก็บปัจจุบัน ในตาราง items
        const item = firestore.collection('items');
        const query = item.doc(id)
        query
        .update({status:'แจ้งซ่อม',room:room_at})
        .then(()=>{
          console.log('Updated Success!!');
        })
        .catch(err =>{
          console.log(err);
        });
      },
      addRepair(data){ // เพิ่มข้อมูลรายการยืมในตาราง repairs
        const repair = firestore.collection('repairs');
        repair.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.sendMessages([
                  {
                    'type' : 'text',
                    'text' : 'แจ้งซ่อมเรียบร้อยแล้วค่ะ'
                  }
                ]).then(() => {
                  this.cancelHandler();
                })
              }
            })
          })
          .catch(err => console.log(err));
      },
      async submitHandler(){
        if(this.items.length > 0){
          let obj = {
            created_by:this.userProfile,
            created_at: new Date()
          };

          let item = []
          for (let i = 0; i < this.items.length; i++) { // loop add ข้อมูลรายการแจ้งซ่อมลงใน data สำหรับไว้ add data ลงตาราง repair
            item[i] = {
              'item_code':this.items[i],
              'room':this.room_at[i],
              'reason':this.reason[i],
              'status':'0'
            }
          }

          obj['items'] = item
          this.queryDoc(obj);
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
      }
    }
  }
</script>