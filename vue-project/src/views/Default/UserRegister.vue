<template>
  <div class="container is-fluid">
    <form @submit.prevent="submitHandler">
      <article class="panel is-primary">
        <p class="panel-heading">
          ลงทะเบียนผู้ใช้ใหม่
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
              <b-field label="หมายเลขบัตรประจำตัวประชาชน"
                v-bind:type="isPidType"
                v-bind:message="isPidMsg">
                <b-input id="pid"
                  name="pid"
                  v-model="pid"
                  maxlength="13">
                </b-input>
              </b-field>
            </div>
            <div class="column">
              <ListPrename :getPrename="getPname"/>
            </div>
            <div class="column">
              <b-field label="ชื่อ">
                <b-input id="fname"
                  name="fname"
                  v-model="fname">
                </b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="นามสกุล">
                <b-input id="lname"
                  name="lname"
                  v-model="lname">
                </b-input>
              </b-field>
            </div>
            <ListUserType :getUsertype="getUtype"/>
            <div class="column">
              <b-field label="เบอร์ติดต่อ"
                v-bind:type="isPhoneType"
                v-bind:message="isPhoneMsg">
                <b-input id="phone"
                name="phone"
                v-model="phone"
                maxlength="10">
                </b-input>
              </b-field>
            </div>
            <div class="column">
              <b-field label="อัพโหลดรูปเพื่อยืนยันตัวตน"
                type="is-info"
                message="กรุณาถ่ายบัตรนักศึกษาหรือบัตรพนักงานเพื่อยืนยันตัวตน">
                <b-field class="file is-primary" :class="{'has-name': !!file}">
                  <b-upload id="file" 
                    name="file"
                    v-model="file" 
                    accept="image/jpeg"
                    class="file-label"
                    rounded>
                    <span class="file-cta">
                      <b-icon class="file-icon" icon="upload"></b-icon>
                      <span class="file-label">{{ file.name || "Click to upload"}}</span>
                    </span>
                  </b-upload>
                </b-field>
              </b-field>
            </div>
          </div>
        </div>
        <div class="panel-block">
          <div class="buttons">
            <button class="button is-primary"
              type="submit">ตกลง</button>
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
  import firestore, { storage } from "../../../../firebase-config/vue/firebase"
  import ListPrename from '../../components/ListPrename.vue'
  import ListUserType from '../../components/ListUserType.vue'
  import Swal from 'sweetalert2'
  const line = require('../../../../line-config/config')

  export default {
    name:'App',
    components: {
      ListPrename,
      ListUserType
    },
    data(){
      return {
        email:null,
        pid:null,
        phone:null,
        pname:null,
        fname:null,
        lname:null,
        usertype:null,
        stuid:null,
        file: {},
        link:null,
        verify:null,
        userProfile: null,
        lblResult:null,
        isSuccessType:null,
        isSuccessMsg:null,
        isEmailType: "is-info",
        isEmailMsg: "กรุณาใช้ NU Mail เพื่อง่ายต่อการตรวจสอบ",
        isPidType: "is-info",
        isPidMsg: "เพื่อใช้สำหรับการ Login เข้าสู่ระบบในครั้งแรก",
        isPhoneType: null,
        isPhoneMsg:null
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
            // console.log(JSON.stringify(profile))
            this.userProfile = profile.userId
          })
          .catch((err) => {
            console.error(err)
          })
        } else {
          // console.log('LIFF is not logged in')
          liff.login()
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err)
      });
    },
    watch:{
      email(){
        if(!this.email){
          this.isEmailType = "is-info"
          this.isEmailMsg = "กรุณาใช้ NU Mail เพื่อง่ายต่อการตรวจสอบ"
        }else{
          this.isEmailType = "is-danger"
          this.isEmailMsg = "กรุณาใส่ @ ลงในอีเมล"
        }
      },
      pid(){
        if(this.pid.length < 13){
          this.isPidType = "is-info"
          this.isPidMsg = "เพื่อใช้สำหรับการ Login เข้าสู่ระบบในครั้งแรก"
        }else if(this.pid.length == 13){
          this.isPidType = "is-success"
          this.isPidMsg = "ข้อมูลถูกต้อง"
        }else{
          this.isPidType = "is-danger"
          this.isPidMsg = "กรอกข้อมูลไม่ถูกต้อง"
        }
      },
      phone(){
        if(this.phone < '0' || this.phone >'9'){
          this.isPhoneType = "is-danger"
          this.isPhoneMsg = "กรุณากรอกเฉพาะตัวเลข"
        }else{
          this.isPhoneType =  null
          this.isPhoneMsg = null
        }
      },
      file(){
        //console.log("file: ",this.file)
      }
    },
    methods:{
      getPname(pName){
        this.pname = pName
      },
      getUtype(utype,sid){
        this.usertype = utype
        this.stuid = sid
      },
      addUserRegister(obj){
        const addUser = firestore.collection("userRegister");
        addUser.add(obj)
          .then(()=>{
            Swal.fire({
              title: 'ลงทะเบียนสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.sendMessages([
                  {
                    'type' : 'text',
                    'text' : 'ลงทะเบียนสำเร็จ'
                  }
                ]).then(() => {
                  liff.closeWindow();
                })
              }
            })
            // console.log("ลงทะเบียนสำเร็จ")
            // this.isSuccessType = "is-success"
            // this.isSuccessMsg = "ลงทะเบียนสำเร็จ"
          })
          .catch(err => console.log(err));
      },
      clearData(){
        this.email = null;
        this.fname = null;
        this.lname = null;
        this.pid = null;
        this.phone = null;
      },
      async submitHandler(){
        if(this.file && this.file.name){
          const userPicRef = storage.child("photos/"+this.pid);
          //const getFilename = this.file.name;
          const random = Math.random();
          const filename = Date.now()+"_"+random.toString().substring(2,8)+".jpg";
          const targetRef = userPicRef.child(filename);
          await targetRef.put(this.file).then(response => {
            response.ref.getDownloadURL().then(photoURL =>{
              const obj = {
                email:this.email,
                pid:this.pid,
                pname:this.pname,
                fname:this.fname,
                lname:this.lname,
                usertype:this.usertype,
                stuid:this.stuid,
                phone:this.phone,
                userid:this.userProfile,
                link:photoURL,
                verify:"true",
                approve:"false",
                approver:null,
                comment:null
              };
              this.addUserRegister(obj);
            });
          });
        }else{
          console.log("no file Upload");
          this.isSuccessType = "is-danger"
          this.isSuccessMsg = "กรุณาอัพโหลดรูปเพื่อยืนยันตัวตน"
        }
      }
    }
  }
</script>