<template>
  <div class='container-fluid'>
    <button
      class='button is-success' 
      type='button' 
      @click='onExport'>
      Export File
    </button>
    <table id='tblExport' class='table table-striped'>
      <thead>
         <tr>
          <td colspan='5' style='text-align:center'>
            <b>รายการครุภัณฑ์ที่จำหน่ายประจำปีงบประมาณ {{ thisYear }}</b>
          </td>
        </tr>
        <tr>
          <th scope='col'>ลำดับ</th>
          <th scope='col'>รายการ</th>
          <th scope='col'>จำนวน/หน่วย</th>
          <th scope='col'>หมายเลขครุภัณฑ์</th>
          <th scope='col'>สถานที่เก็บ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='data,index in datas' :key='index'>
          <th scope='row'>{{ index + 1 }}</th>
          <td>{{ data.name }}</td>
          <td>{{ data.unit }}</td>
          <td>{{ data.item_code }}</td>
          <td>{{ data.room }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { utils , writeFileXLSX } from 'xlsx' // import xlsx
import firestore from '../../../../firebase-config/vue/firebase';

const line = require('../../../../line-config/config');

export default {
  name: 'app',
  data(){
    return {
      datas: [],
      userProfile:null,
      thisYear: new Date().getFullYear() + 543
    }
  },
  created(){
    let year = new Date().getFullYear(); //.toLocaleString();
    let start = new Date(year, 0, 1); // year, month 0 (jan), date 1
    let end = new Date(year, 12, 31); // year, month 12 (dec), date 31
    
    let obj = [];
    let arr = [];
    const docRef = firestore.collection('sells');
    const query = docRef
      .where('created_at','>=',start)
      .where('created_at','<=',end)
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
              'unit': res.unit,
              'item_code': data.item_code,
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
  methods: {
    onExport() { // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
      const elt = document.getElementById('tblExport');
      const dataWS = utils.table_to_book(elt,{sheet: 'ส่งพี่บ๊วย'});
      writeFileXLSX(dataWS,'รายการจำหน่าย '+ this.thisYear +'.xlsx');
    },
    itemName(id, callback){
      const docRef = firestore.collection('items');
      const query = docRef
        .where('item_code','==',id)
      query
      .get()
      .then(snapshot =>{
         snapshot.forEach((doc) => {
          callback({
            name: doc.data().name, 
            unit: doc.data().unit
          })
        });
      })
      .catch(err =>{
        console.log(err);
      });
    }
  }
}
</script>