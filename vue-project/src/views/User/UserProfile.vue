<template>
<div class="card" style="width: 18rem;">
  <img :src="photo" class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">ชื่อ: {{ fullName }}</h5>
    <p class="card-text">ประเภทผูัใช้งาน: {{ userType }}</p>
  </div>
</div>
</template>
<script>
import firestore from "../../../../firebase-config/vue/firebase"
const userRegister = firestore.collection("userRegister")

export default {
  name:'Profile',
  data(){
    return {
      photo:"#",
      fullName:null,
      userType:null
    };
  },
  created() {
    // const query = userRegister
    // .where("userid","==",'')
    // query
    // .get()
    // .then(snapshot =>{
    //   snapshot.forEach((doc)=>{
    //     this.photo = doc.data().link
    //     this.fullName = doc.data().pname + doc.data().fname + ' '+ doc.data().lname
    //     this.userType = doc.data().usertype
    //   })
    // })
    // .catch(err =>{
    //   console.log(err);
    // })
    console.log('test');
  }
}
</script>