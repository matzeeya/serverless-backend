<template>
  <div>
    <p>กำลังบันทึกข้อมูล กรุณารอสักครู่...</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');
  
  export default {
    data() {
      return {
        photo: 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
        code: this.$route.params.code,
        userProfile: null,
        item: [],
        item_code: null,
        room_db: null,
        room_old: null,
        room_at: null
      }
    },
    mounted() {
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId
          })
          .catch((err) => {
            console.error(err)
          })
        } else {
          console.log('LIFF is not logged in')
          liff.login()
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err)
      });
    },
    created(){
      axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + this.code)
      .then((doc) => {
        this.item = doc.data[0];
        this.room_db = doc.data[0].room;

        const search = this.room_db.search('ห้อง');
        if(search >= 0){
          const splitRoom = this.room_db.split('ห้อง ');
          this.room_old = splitRoom[1];
        }else{
          this.room_old = this.room_db;
        }

        const data = {
          item_code: this.item.item_code,
          item_type: this.item.item_type,
          length: this.item.length,
          kind: this.item.kind,
          name: this.item.name,
          brand: this.item.brand,
          model: this.item.model,
          serial: this.item.serial,
          warranty: this.item.warranty,
          price: this.item.price,
          unit: this.item.unit,
          organization: this.item.organization,
          room: this.room_old,
          room_db: this.item.room,
          room_old: this.room_old,
          procurement:{
            method: this.item.procurement[0].method,
            source: this.item.procurement[0].source,
            year: this.item.procurement[0].year,
            docno_withdraw: this.item.procurement[0].docno_withdraw,
            owner_withdraw: this.item.procurement[0].owner_withdraw,
            contact_no: this.item.procurement[0].contact_no,
            contact_date: this.item.procurement[0].contact_date,
            received_date: this.item.procurement[0].received_date,
            vender: this.item.procurement[0].vender,
            doc_invoice: this.item.procurement[0].doc_invoice
          },
          status: this.item.status,
          appearance: this.item.appearance,
          holder: this.item.holder,
          reference: this.item.reference,
          create_by: this.userProfile,
          created_at: new Date().toLocaleString()
        };
        this.addItem(data);
      })
      .catch((err) => {
        console.log(err);
      });
    },
    methods : {
      addItem(data){
        const item = firestore.collection('items');
        item.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.closeWindow()
              }
            })
          })
          .catch(err => console.log(err));
      }
    }
  }
</script>