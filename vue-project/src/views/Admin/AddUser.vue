<template>
  <div class="container is-fluid">
    <form @submit.prevent="submitHandler">
      <article class="panel is-primary">
        <p class="panel-heading">
          เพิ่มข้อมูลผู้ใช้งาน
        </p> 
        <div class="panel-block">
          <div class="columns is-desktop">
            <!-- คำนำหน้า -->
            <div class="column">
              <ListPrename :getPrename="getPname"/>
            </div>
            <!-- ชื่อ -->
            <div class="column">
              <b-field label="ชื่อ">
                <b-input id="fname"
                  name="fname"
                  v-model="fname">
                </b-input>
              </b-field>
            </div>
            <!-- นามสกุล -->
            <div class="column">
              <b-field label="นามสกุล">
                <b-input id="lname"
                  name="lname"
                  v-model="lname">
                </b-input>
              </b-field>
            </div>
            <!-- อีเมล -->
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
            <!-- เบอร์โทรศัพท์ -->
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
            <!-- คณะ -->
            <ListFaculty :getFaculty="getFacultys"/>
            <!-- ภาควิชา -->
            <ListDepartment :getDepartment="getDepartments"/>
            <!-- ประเภทผู้ใช้งาน -->
            <ListPosition :getPosition="getPositions"/>
            <!-- สิทธิผู้ใช้งาน -->
            <ListUserType :getUserType="getUserTypes"/>
          </div>
        </div>
        <div class="panel-block">
          <div class="buttons">
            <button class="button is-primary"
              type="submit">เพิ่มข้อมูล</button>
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
  import ListPrename from '../../components/ListPrename.vue'
  import ListPosition from '../../components/ListPosition.vue'
  import ListUserType from '../../components/ListUserType.vue'
  import ListFaculty from '../../components/ListFaculty.vue'
  import ListDepartment from '../../components/ListDepartment.vue'
  import Swal from 'sweetalert2'
  const line = require('../../../../line-config/config')

  export default {
    name:'App',
    components: {
      ListPrename,
      ListPosition,
      ListUserType,
      ListFaculty,
      ListDepartment
    },
    data(){
      return {
        pname:null,
        fname:null,
        lname:null,
        email:null,
        phone:null,
        position:null,
        stuid:null,
        usertype:null,
        faculty:null,
        department:null,
        userProfile: null,
        lblResult:null,
        isSuccessType:null,
        isSuccessMsg:null,
        isEmailType: "is-info",
        isEmailMsg: "กรุณาใช้ NU Mail เพื่อง่ายต่อการตรวจสอบ",
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
            this.userProfile = profile.userId
          })
          .catch((err) => {
            console.error(err)
          })
        } else {
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
      phone(){
        if(this.phone < '0' || this.phone >'9'){
          this.isPhoneType = "is-danger"
          this.isPhoneMsg = "กรุณากรอกเฉพาะตัวเลข"
        }else{
          this.isPhoneType =  null
          this.isPhoneMsg = null
        }
      }
    },
    methods:{
      getPname(pName){
        this.pname = pName
      },
      getPositions(res,sid){
        this.position = res
        this.stuid = sid
      },
      getUserTypes(res){
        this.usertype = res
      },
      getFacultys(res){
        this.faculty = res
      },
      getDepartments(res){
        this.department = res
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
          })
          .catch(err => console.log(err));
      },
      clearData(){
        this.fname = null;
        this.lname = null;
        this.phone = null;
        this.email = null;
      },
      async submitHandler(){
        const obj = {
          pname:this.pname,
          fname:this.fname,
          lname:this.lname,
          email:this.email,
          phone:this.phone,
          position:this.position,
          student_id:this.stuid,
          usertype:this.usertype,
          faculty:this.faculty,
          department:this.department,
          required:"0",
          active:"0",
          created_at:this.userProfile
        };
        this.addUserRegister(obj);
      }
    }
  }
</script>