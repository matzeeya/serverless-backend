<template>
  <div>
    <p>ทดสอบการทำงานของ Vue Lifecycle Diagram {{ name }}</p>
  </div>
</template>
<script>
  import firestore from '../../../../firebase-config/vue/firebase';
  const line = require('../../../../line-config/config');
  export default {
    data() {
      return {
        userProfile: null,
        name: null
      }
    },
    methods:{
      getUserData(callback){
        const docRef = firestore.collection('userRegister');
        const query = docRef
        .where('userid','==',this.userProfile)
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            if(doc.data().type === 'user'){
              callback(doc.data().usertype);
            }else{
              callback(doc.data().usertype);
            }
          });
        })
        .catch(err =>{
          console.log(err);
        });
      }
    },
    created(){
      console.log('beforeCreate');
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
            console.log(this.userProfile);
            this.getUserData((res)=>{
              this.name = res;
            });
          })
          .catch((err) => {
            console.error(err);
          })
        } else {
          liff.login();
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err);
      });
    }
  }
</script>