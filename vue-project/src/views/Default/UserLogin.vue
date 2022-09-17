<template>
  <div class="container is-fluid">
    <form @submit.prevent="submitHandler">
      <article class="panel is-primary">
        <p class="panel-heading">
          เข้าสู่ระบบ
        </p> 
        <div class="panel-block">
          <div class="columns is-desktop">
            <div class="column">
              <b-field label="อีเมล"
                v-bind:type="isEmailType"
                v-bind:message="isEmailMsg">
                <b-input type="email" 
                  id="email" 
                  name="email"
                  v-model="email"
                  maxlength="30"
                  placeholder="email@nu.ac.th">
                </b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="รหัสผ่าน"
                v-bind:type="isPidType"
                v-bind:message="isPidMsg">
                <b-input id="pid"
                  name="pid"
                  v-model="pid"
                  maxlength="13"
                  placeholder="หมายเลขบัตรประจำตัวประชาชน">
                </b-input>
              </b-field>
            </div>
          </div>
        </div>
        <div class="panel-block">
          <div class="buttons">
            <button class="button is-primary"
              type="submit">ลงชื่อเข้าใช้</button>
            <button class="button is-danger"
              @click="clearData">ยกเลิก</button>
            <b-field 
              v-model="lblResult"
              v-bind:type="isSuccessType"
              v-bind:label="isSuccessMsg">
            </b-field>
          </div>
        </div>
      </article>
    </form>
  </div>
</template>
<script>
  import firestore from "../../../../firebase-config/vue/firebase"
  const userRegister = firestore.collection("userRegister");

  export default {
    name:'App',
    data(){
      return {
        email:null,
        pid:null,
        lblResult:null,
        isSuccessType:null,
        isSuccessMsg:null,
        isEmailType: "is-info",
        isEmailMsg: "กรุณาใช้ NU Mail เพื่อง่ายต่อการตรวจสอบ",
        isPidType: "is-info",
        isPidMsg: "เพื่อใช้สำหรับการ Login เข้าสู่ระบบในครั้งแรก",
      }
    },
    methods:{
      clearData(){
        this.email = null;
        this.pid = null;
      },
      async submitHandler(){
        userRegister.get().then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data()){
            // console.log(doc.data().userid)
            console.log("เข้าสู่ระบบ")
          }else{
            this.isSuccessType = "is-danger"
            this.isSuccessMsg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          }
        })
      })
      }
    }
  }
</script>