<template>
  <div class="card" style="width: 18rem;">
  <img :src="photo" class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">ชื่อครุภัณฑ์: {{ itemname }}</h5>
    <p class="card-text">หมายเลขครุภัณฑ์: {{ itemnumber }}</p>
  </div>
</div>
</template>
<script>
import firestore from "../../../db/firebase"
const searchItem = firestore.collection("items")
export default {
  name:'SearchInventory',
  data(){
    return {
      photo:"#",
      itemname:null,
      itemnumber:null
    }
  },
  created() {
    const query = searchItem
    .where("item_number","==",'7450-010-24573')
    query
    .get()
    .then(snapshot =>{
      snapshot.forEach((doc)=>{
        this.photo = doc.data().photo
        this.itemname = doc.data().item_name
        this.itemnumber = doc.data().item_number
      })
    })
    .catch(err =>{
      console.log(err);
    })
  }
}
</script>