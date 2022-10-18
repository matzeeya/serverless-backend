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
            <td><ListRoom :getAllRoom='getRoom'/></td>
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
  import ListRoom from '../components/ListRoom.vue';
  import firestore from '../../../firebase-config/vue/firebase';

  const line = require('../../../line-config/config');

  export default {
    components: {
      ListRoom
    },
    data() {
      return {
        photo: 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
        code: this.$route.params.code,
        userProfile: null,
        items: [],
        delItem: [],
        room_at: [],
        reason: null
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
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key.search('item:') >= 0){
          this.items.push(localStorage.getItem(key));
        }
      }
      // console.log(this.items);
    },
    methods : {
      getRoom(room){
        this.room_at.push(room);
      },
      deleteItem(){
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
      cancelHandler(){
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if(key.search('item:') >= 0){
            localStorage.removeItem(key);
          }
        }
        liff.closeWindow();
      },
      queryDoc(data){
        for (let i = 0; i < this.items.length; i++) {
          const docRef = firestore.collection('items');
          const query = docRef
            .where('item_code','==',this.items[i]);
          query
          .get()
          .then(snapshot =>{
            snapshot.forEach((doc) => {
              // console.log(doc.id);
              this.updateStatus(doc.id,this.room_at[i],data)
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
      },
      updateStatus(id,room_at,data){
        const item = firestore.collection('items');
        const query = item.doc(id)
        query
        .update({status:'ถูกยืม',room:room_at})
        .then(()=>{
          console.log('Updated Success!!');
          this.addBorrow(data);
        })
        .catch(err =>{
          console.log(err);
        });
      },
      addBorrow(data){
        const borrow = firestore.collection('borrows');
        borrow.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                this.cancelHandler();
                liff.closeWindow();
              }
            })
          })
          .catch(err => console.log(err));
      },
      async submitHandler(){
        let obj = {
          borrow_by:this.userProfile,
          reason: this.reason,
          created_at: new Date().toLocaleString()
        };

        for (let i = 0; i < this.items.length; i++) {
          obj[i] = {'item_code':this.items[i],'room':this.room_at[i],'status':'0'}
        }

        this.queryDoc(obj);
      }
    }
  }
</script>