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
  import firestore, { storage } from "../../../db/firebase"

  export default {
    name:'AddItem',
    data(){
      return {
        file: {},
      }
    },
    watch:{
      file(){
        //console.log("file: ",this.file)
      }
    },
    methods:{
      addUserRegister(obj){
        const addUser = firestore.collection("userRegister");
        addUser.add(obj)
          .then(()=>{
            console.log("ลงทะเบียนสำเร็จ")
            this.isSuccessType = "is-success"
            this.isSuccessMsg = "ลงทะเบียนสำเร็จ"
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
                userid:null,
                link:photoURL,
                verify:"true",
                approve:"false",
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