<template>
  <div>
    <!-- <form @submit.prevent="submit"> -->
      <div 
        v-for="user,index in users"
        :key="index"
        class="card" 
        style="width: 18rem;">
        <img :src="user.link" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">ชื่อ: {{ user.name}}</h5>
          <p class="card-text">ประเภทผูัใช้งาน: {{ user.utype }}</p>
          <button class="btn btn-primary" @click="approve($event)" :value="user.id">Approved</button>
          <button class="btn btn-danger" @click="reject($event)"  :value="user.id">Reject</button>
        </div>
      </div>
  </div>
</template>

<script>
// import axios from axios
import Swal from 'sweetalert2'
import firestore from "../../../db/firebase"
const userRegister = firestore.collection("userRegister")

export default {
  name: 'Verify',
  data () {
    return {
      users: []
    }
  },
  created() {
    const query = userRegister
    .where("approve","==",'0')
    query
    .get()
    .then(snapshot =>{
      let userList = [];
      snapshot.forEach((doc)=>{
        const data = {
          id: doc.id,
          name: doc.data().pname + doc.data().fname + ' '+ doc.data().lname,
          utype: doc.data().usertype,
          link: doc.data().link
        };
        userList = [...userList,data];
      });
      this.users = userList;
    })
    .catch(err =>{
      console.log(err);
    })
  },
  methods : {
      approve: function(e) {
        Swal.fire({
          title: 'ยืนยันคำตอบ?',
          text: 'อนุมัติผู้ใช้งาน?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#1ABC9C'
      }).then((result) => {
        if (result.isConfirmed) {
          let id = e.target.value
          userRegister.doc(id)
          .update({approve: "1"})
          .then(res => {
            console.log(res)
            location.reload(true)
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
      },
      reject: function(e) {
        Swal.fire({
          title: 'ยืนยันคำตอบ?',
          text: 'ไม่อนุมัติผู้ใช้งาน?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#E74C3C'
      }).then((result) => {
        if (result.isConfirmed) {
          let id = e.target.value
          userRegister.doc(id)
          .update({approve: "2"})
          .then(res => {
            console.log(res)
            location.reload(true)
          })
          .catch(err => {
            console.log(err);
          })
        }
      })
      }
    // submit(){
    //   axios.post('/your-url', {name: this.name})
    //   .then(res => {
    //     // do something with res
    //   })
    //   .catch(err => {
    //     // catch error
    //   })
    // }
  }
}
</script>