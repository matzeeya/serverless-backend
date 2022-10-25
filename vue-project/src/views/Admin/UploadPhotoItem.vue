<template>
  <div class="container is-fluid">
    <form @submit.prevent="submitHandler">
      <article class="panel is-primary">
        <p class="panel-heading">
          เพิ่มรายการครุภัณฑ์
        </p> 
        <div class="panel-block">
          <div class="columns is-desktop">
            <div class="column">
              <b-field label="อัพโหลดรูปครุภัณฑ์"
                type="is-info"
                message="กรุณาอัพโหลดรูปครุภัณฑ์">
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

  export default {
    name:'AddItem',
    data(){
      return {
        file: {},
        photo:null,
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
            console.log("เพิ่มข้อมูลสำเร็จ")
            this.isSuccessType = "is-success"
            this.isSuccessMsg = "เพิ่มข้อมูลสำเร็จ"
          })
          .catch(err => console.log(err));
      },
      clearData(){
        //
      },
      async submitHandler(){
        if(this.file && this.file.name){
          const userPicRef = storage.child("item/"+this.pid);
          const random = Math.random();
          const filename = Date.now()+"_"+random.toString().substring(2,8)+".jpg";
          const targetRef = userPicRef.child(filename);
          await targetRef.put(this.file).then(response => {
            response.ref.getDownloadURL().then(photoURL =>{
              const obj = {
                photo:photoURL
              };
              this.addUserRegister(obj);
            });
          });
        }else{
          console.log("no file Upload");
          this.isSuccessType = "is-danger"
          this.isSuccessMsg = "กรุณาอัพโหลดรูปครุภัณฑ์"
        }
      }
    }
  }
</script>