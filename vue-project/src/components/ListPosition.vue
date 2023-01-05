<template>
  <div class="column">
    <b-field label="ประเภทผู้ใช้งาน">
      <div class="select">
        <select id="userType"
            name="userType"
            v-model="userType"
            @change="setSelected($event)"
            style="width:280px">
          <option v-for="utype in utypes" 
            v-bind:key="utype">
              {{utype}}
            </option>
        </select>
      </div>
    </b-field>
    <b-field label="รหัสนักศึกษา" 
      v-bind:type="isStuType"
      v-bind:message="isStuMsg"
      v-if="isType">
      <b-input id="stuid"
        name="stuid"
        v-model="stuid"
        maxlength="8">
      </b-input>
    </b-field>
</div>
</template>
<script>
import firestore from "../../../firebase-config/vue/firebase"
export default {
name: 'Position',
props:{
  getPosition:Function
},
data () {
  return {
    utypes: [],
    userType:null,
    isType: false,
    stuid:null,
    isStuType: null,
    isStuMsg:null
  }
},
created() {
  const userType = firestore.collection("user_type").orderBy("name","asc")
  userType.get().then(snapshot => {
    snapshot.forEach(doc => {
      if (doc.data()){
        this.utypes.push(doc.data().name_th)
      }
    })
  })
},
methods: {
  setSelected(event){
    let uType = event.target.value
    if(uType === "นักศึกษา"){
      this.isType = true
      if(this.stuid !== null){
        this.getPosition(uType,this.stuid)
      }else{
        console.log("ยังไม่ได้กรอกรหัสนักศึกษา")
        this.isStuType = "is-danger"
        this.isStuMsg = "กรุณากรอกรหัสนักศึกษา"
      }
    }else{
      this.stuid = null;
      this.isType = false
      this.getPosition(uType,null)
    }
  }
},
watch:{
  stuid(){
    if(this.stuid < '0' || this.stuid >'9'){
      this.isStuType = "is-danger"
      this.isStuMsg = "กรุณากรอกเฉพาะตัวเลข"
    }else{
      this.isStuType =  null
      this.isStuMsg = null
      if(this.stuid.length == 8){
        this.getPosition(this.userType,this.stuid)
      }
    }
  }
}
}
</script>