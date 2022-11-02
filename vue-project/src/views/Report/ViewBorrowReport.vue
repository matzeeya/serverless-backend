<template>
  <div class='container-fluid'>
    <form @submit.prevent='submitHandler'>
      <button
        class='button is-success' 
        type='submit'>
        Export PDF
      </button>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ลำดับ</th>
            <th scope='col'>รายการ</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>S/N</th>
            <th scope='col'>สถานที่เก็บ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='data,index in datas' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ data.name }}</td>
            <td>{{ data.item_code }}</td>
            <td>{{ data.serial }}</td>
            <td>{{ data.room }}</td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>
<script>
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');

  export default {
    data() {
      return {
        userProfile: null,
        datas:[],
        dateNow: new Date()
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
    created(){
    console.log(this.dateNow) 
    let obj = [];
    let arr = [];
    const docRef = firestore.collection('borrows');
    const query = docRef
      .where('created_at','==',this.dateNow)
      .where('borrow_by','==',this.userProfile)
    query
    .get()
    .then(snapshot =>{
      let index=1;
      snapshot.forEach((doc) => {
        for(let i=0; i < doc.data().items.length; i++){
          let data = doc.data().items[i];
          this.itemName(data.item_code, function(res) {
            obj = {
              'id': index,
              'name': res.name,
              'item_code': data.item_code,
              'serial': res.serial,
              'room': data.room,
            }
            arr.push(obj);
            index++;
          });
        }
        this.datas = arr;
      });
    })
    .catch(err =>{
      console.log(err);
    });
  },
    methods : {
      itemName(id, callback){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',id)
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            callback({
              name: doc.data().name, 
              serial: doc.data().serial
            })
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      async submitHandler(){
        console.log(this.userProfile);
      }
    }
  }
</script>