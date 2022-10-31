<template>
  <!-- <div style='text-align:center;' >
    <button @click='onExport' >Export</button> 
  </div> -->
  <section>
    <b-field grouped group-multiline>
      <div class="control">
        <b-switch v-model="isEmpty">Empty</b-switch>
      </div>
      <div class="control">
        <b-switch v-model="hasMobileCards">Mobile cards <small>(collapsed rows)</small></b-switch>
      </div>
    </b-field>

    <b-table
      :data="isEmpty ? [] : data"
      :mobile-cards="hasMobileCards">

      <b-table-column field="id" label="ID" width="40" :td-attrs="columnTdAttrs" numeric v-slot="props">
        {{ props.row.id }}
      </b-table-column>

      <b-table-column field="first_name" label="First Name" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.first_name }}
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No records</div>
      </template>
    </b-table>
  </section>
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
        isEmpty: false,
        hasMobileCards: true
      // datas: [ // ข้อมูล JSON ทีต้องการ Export
      //   { no: '1', name: 'เครื่องคอมพิวเตอร์', unit: '1', item_code: '7450-010-12542', room: 'EE102' },
      //   { no: '2', name: 'เครื่องคอมพิวเตอร์', unit: '1', item_code: '7450-010-12543', room: 'EE102' },
      //   { no: '3', name: 'เครื่องคอมพิวเตอร์', unit: '1', item_code: '7450-010-12544', room: 'EE102' },
      // ]
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
      let start = new Date('2022-01-01');
      let end = new Date('2022-12-31');
      const docRef = firestore.collection('borrows');
      const query = docRef
        .where('created_at','>=',start)
        .where('created_at','<=',end)
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
    },
  // methods: {
    // onExport() { // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
      // const dataWS = utils.json_to_sheet(this.datas,{ header:['ลำดับ','รายการ','จำนวน/หน่วย','หมายเลขครุภัณฑ์','สถานที่เก็บ'] });
      // const wb = utils.book_new();
      // utils.book_append_sheet(wb, dataWS);

      // writeFileXLSX(wb,'รายการจำหน่าย.xlsx');
    // },
  // }
}
</script>