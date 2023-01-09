<template>
  <div>
    <div 
      v-for="user,index in users"
      :key="index"
      class="card" 
      style="width: 18rem;">
      <img :src="user.link" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">ชื่อ: {{ user.name}}</h5>
        <p class="card-text">ประเภทผูัใช้งาน: {{ user.position }}</p>
        <button class="btn btn-primary" @click="approve($event)" :value="user.id">Approved</button>
        <button class="btn btn-danger" @click="reject($event)"  :value="user.id">Reject</button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import firestore from "../../../../firebase-config/vue/firebase";
const userRequired = firestore.collection("user");
const line = require('../../../../line-config/config');

export default {
  name: 'ApprovedUser',
  data () {
    return {
      ureq: this.$route.params.ureq,
      userProfile: null,
      users: []
    }
  },
  mounted(){
    const liff = this.$liff
    liff.init({
      liffId: line.liffID
    }).then(() => {
      if (liff.isLoggedIn()) {
        liff.getProfile()
        .then(profile => {
          this.userProfile = profile.userId;
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
  },
  created() {
    const query = userRequired
    .where('userid','==',this.ureq)
    .where('required','==',"0")
    query
    .get()
    .then(snapshot =>{
      let userList = [];
      snapshot.forEach((doc)=>{
        const data = {
          id: doc.id,
          name: doc.data().pname + doc.data().fname + ' '+ doc.data().lname,
          position: doc.data().position
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
            userRequired.doc(id)
            .update({approve: true,approver: this.userProfile,approved_at:new Date()})
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
            userRequired.doc(id)
            .update({approve: false,approver: this.userProfile})
            .then(() => {
              location.reload(true)
            })
            .catch(err => {
              console.log(err);
            })
          }
        })
      }
  }
}
</script>