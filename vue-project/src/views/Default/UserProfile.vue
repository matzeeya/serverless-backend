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
import firestore from "../../../db/firebase"
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
    const query = userRegister
    .where("userid","==",'U526d4d82828ca15b4df1c38ae37047b7')
    query
    .get()
    .then(snapshot =>{
      snapshot.forEach((doc)=>{
        this.photo = doc.data().link
        this.fullName = doc.data().pname + doc.data().fname + ' '+ doc.data().lname
        this.userType = doc.data().usertype
      })
    })
    .catch(err =>{
      console.log(err);
    })
  }
}
</script>