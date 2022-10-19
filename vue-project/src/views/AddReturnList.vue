<template>
  <div>
    <p>เพิ่มรายการคืนครุภัณฑ์: {{ code }}</p>
  </div>
</template>
<script>
  import firestore from '../../../firebase-config/vue/firebase';
  const line = require('../../../line-config/config')
  export default {
    data() {
      return {
        photo: "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG",
        code: this.$route.params.code,
        userProfile: null
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
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
    created() {
      const docRef = firestore.collection('items');
      const query = docRef
        .where('item_code','==',this.code);
      query
      .get()
      .then(snapshot =>{
        snapshot.forEach((doc) => {
          console.log("items: "+ doc.id);
          this.addList(doc.data().room);
        });
      })
      .catch(err =>{
        console.log(err);
      }); 
    },
    methods:{
      addList(room){
        const docRef = firestore.collection('borrows');
        const query = docRef
          .where('items','array-contains',{
            'item_code': this.code,
            'room': room,
            'status': '0'
          });
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            console.log("borrow: "+ doc.id);
            localStorage.setItem("item:"+this.code, this.code);
            liff.closeWindow()
          });
        })
        .catch(err =>{
          console.log(err);
        }); 
      }
    }
  }
</script>