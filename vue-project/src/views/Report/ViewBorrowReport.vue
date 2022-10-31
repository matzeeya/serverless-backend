<template>
  <div>
    <!-- <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ลำดับที่</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan='3'>
              <button class='button is-success' type='submit'>Export PDF</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form> -->
  </div>
  <!-- <section>
    <b-table
      :data="isEmpty ? [] : data"
      :mobile-cards="hasMobileCards">

      <b-table-column field="id" label="ลำดับที่" width="40" :td-attrs="columnTdAttrs" numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="item_code" label="หมายเลขครุภัณฑ์" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.item_code }}
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No records</div>
      </template>
    </b-table>
  </section> -->
</template>
<script>
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');

  export default {
    data() {
      // const items = [
      //     { 'id': 1, 'item_code': '7450-010-13391' },
      //     { 'id': 2, 'item_code': '7450-010-13392' },
      //     { 'id': 3, 'item_code': '7450-010-13393' },
      //     { 'id': 4, 'item_code': '7450-010-13394' },
      //     { 'id': 5, 'item_code': '7450-010-13395' },
      // ]
      return {
        userProfile: null,
        items:[],
        // isEmpty: false,
        // hasMobileCards: true
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
    methods : {
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
              console.log(doc.id);
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
      },
      async submitHandler(){
        console.log(this.userProfile);
        // if(this.items.length > 0){
        //   let obj = {
        //     borrow_by:this.userProfile,
        //     reason: this.reason,
        //     created_at: new Date()
        //   };

        //   let item = []
        //   for (let i = 0; i < this.items.length; i++) { // loop add ข้อมูลรายการยืมลงใน data สำหรับไว้ add data ลงตาราง borrows
        //     item[i] = {'item_code':this.items[i],'room':this.room_at[i],'status':'0'}
        //   }

        //   obj['items'] = item
        //   this.queryDoc(obj);
        // }else{
        //   Swal.fire({
        //     title: 'ผิดพลาด',
        //     text: 'กรุณาเพิ่มรายการครุภัณฑ์ก่อนค่ะ',
        //     icon: 'error'
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       liff.closeWindow()
        //     }
        //   })
        // }
      }
    }
  }
</script>