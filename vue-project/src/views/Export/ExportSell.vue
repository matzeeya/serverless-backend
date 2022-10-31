<template>
  <section>
    <b-table
      :datas="isEmpty ? [] : datas"
      :mobile-cards="hasMobileCards">

      <b-table-column field="item_code" label="หมายเลขครุภัณฑ์" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.item_code }}
      </b-table-column>

      <b-table-column field="room" label="สถานที่เก็บ" :td-attrs="columnTdAttrs" v-slot="props">
        {{ props.row.room }}
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No records</div>
      </template>
    </b-table>
    <button @click='onExport' >Export</button> 
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
      // data:[
      //   {'item_code':'7450-010-13406','room':'EE106'},
      //   {'item_code':'7450-010-13407','room':'EE113'},
      // ],
      isEmpty: false,
      hasMobileCards: true,
      userProfile:null,
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
  beforeMount() {
    let year = new Date().getFullYear(); //.toLocaleString();
    let start = new Date(year, 0, 1); // year, month 0 (jan), date 1
    let end = new Date(year, 12, 31); // year, month 12 (dec), date 31

    let obj = [];

    const docRef = firestore.collection('borrows');
    const query = docRef
      .where('created_at','>=',start)
      .where('created_at','<=',end)
    query
    .get()
    .then(snapshot =>{
      snapshot.forEach((doc) => {
        // console.log(doc.id)
        for(let i=0; i < doc.data().items.length; i++){ // loop จำนวนรายการยืมใน field items
          obj = {
            'item_code':doc.data().items[i].item_code,
            'room':doc.data().items[i].room,
          }
          this.datas.push(obj);
        }
      });
      // console.log('data',this.data);
      console.log('datas',this.datas);
    })
    .catch(err =>{
      console.log(err);
    });
  },
  methods: {
    onExport() { // เมื่อกดปุ่มจะทำการสร้างไฟล์ xcel ด้วย xlsx
      const dataWS = utils.json_to_sheet(this.datas);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, dataWS);

      writeFileXLSX(wb,'รายการจำหน่าย.xlsx');
    },
  }
}
</script>