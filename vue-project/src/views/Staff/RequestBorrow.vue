<template>
  <div class='container-fluid'>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col' colspan='5'>คำขอรายการยืม</th>
          </tr>
          <tr>
            <th scope='col'>ลำดับ</th>
            <th scope='col'>รายการ</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>S/N</th>
            <th scope='col'>สถานที่เก็บ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.item_code }}</td>
            <td>{{ item.serial }}</td>
            <td>{{ item.room }}</td>
          </tr>
          <tr>
            <td colspan='5'><p>มีความประสงค์ยืม วัสดุ/ครุภัณฑ์ ของคณะ เพื่อ <u>{{ items.reason }}</u></p></td>
          </tr>
          <tr v-for='user,index in users' :key='index'>
            <td colspan='3'>&nbsp;</td>
            <td colspan='2' ><p>ชื่อผู้ยืม <u>{{ user.fullname }}</u></p></td>
          </tr>
          <tr>
            <td colspan='3'>&nbsp;</td>
            <td colspan='2' ><p>วันที่ยืม <u>{{ items.created_at }}</u></p></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan='5'>
              <button class='button is-success' type='submit'>อนุมัติรายการยืม</button>
              <button class='button is-danger' @click='cancelHandler'>ไม่อนุมัติรายการยืม</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  </div>
</template>
<script>
  import moment  from 'moment'
  import Swal from 'sweetalert2'
  import firestore from '../../../../firebase-config/vue/firebase';
  const line = require('../../../../line-config/config');

  export default {
    data() {
      return {
        ureq: this.$route.params.ureq,
        userProfile: null,
        dateNow: moment().format('ll'),
        items: [],
        users: []
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        // console.log('LIFF initialize finished');
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
          })
          .catch((err) => {
            console.error(err);
          })
        } else {
          // console.log('LIFF is not logged in');
          liff.login();
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err);
      });
    },
    created(){
      let obj = [];
      let arr = [];
      let user = [];
      let data = [];
      let m1 = moment();
      let m2 = moment();
      m1.startOf('day');
      m2.endOf('day');

      const docRef = firestore.collection('requestBorrow');
      const query = docRef
        .where('borrow_by','==',this.ureq)
        .where('created_at', '>=', m1.toDate())
        .where('created_at', '<=', m2.toDate())
      query
      .get()
      .then(snapshot =>{
        let index=1;
        snapshot.forEach((doc) => {
          for(let i=0; i < doc.data().items.length; i++){
            let data = doc.data().items[i];
            this.itemName(data.item_code, function(res) {
              if(res){
                obj = {
                  'id': index,
                  'name': res.name,
                  'item_code': data.item_code,
                  'serial': res.serial,
                  'room': data.room,
                }
                arr.push(obj);
                arr['doc'] = doc.id;
                arr['reason'] = doc.data().reason;
                index++; 
              }
            });
          }

          this.thaiDate(this.dateNow, function(res) {
            arr['created_at'] = res
          });
          this.items = arr;

          this.checkType(this.ureq, function(res) {
            data = {
              fullname: res.fullname,
              userType: res.userType,
              stuid: res.stuid
            }
            user.push(data);
          });
          this.users = user;
        });
      })
      .catch(err =>{
        console.log(err);
      });
    },
    methods : {
      cancelHandler(){ // เมื่อคลิกปุ่ม ยกเลิก
        this.rmRequest(this.items.doc,(res) =>{
          if(res === 'success'){
            liff.sendMessages([
              {
                'type' : 'text',
                'text' : 'ไม่อนุมัติรายการยืมค่ะ'
              }
            ]).then(() => {
              liff.closeWindow();
            })
          }
        })
      },
      itemName(id, callback){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',id)
          .where('status','==','ใช้งาน')
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            callback({
              name: doc.data().name, 
              serial: doc.data().serial
            })
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      async submitHandler(){
        this.checkType(this.userProfile,(res) =>{
          if(res.type === '1'){ // ถ้า type == เจ้าหน้าที่ หรือ ผู้ดูแลระบบ
            if(this.items.length > 0){
              let obj = {
                borrow_by: this.ureq,
                reason: this.items.reason,
                created_at: new Date()
              };

              let item = [];
              for (let i = 0; i < this.items.length; i++) { // loop add ข้อมูลรายการยืมลงใน data สำหรับไว้ add data ลงตาราง borrows
                item[i] = {
                  'item_code': this.items[i].item_code,
                  'room': this.items[i].room,
                  'status':'0'
                }
              }

              obj['items'] = item;
              // this.queryDoc(obj);
              // console.log('data ',obj);
              this.rmRequest(this.items.doc,(res) =>{
                if(res === 'success'){
                  this.queryDoc(obj);
                }
              })
            }
          }else{
            Swal.fire({
            title: 'ผิดพลาด',
              text: 'คุณไม่มีสิทธิ์ในหน้านี้ค่ะ',
              icon: 'error'
            }).then((result) => {
              if (result.isConfirmed) {
                liff.closeWindow();
              }
            })
          }
        })          
      },
      checkType(uid,callback){ // เช็คประเภทผู้ใช้งาน
        const docRef = firestore.collection('userRegister');
        const query = docRef
        .where('userid','==',uid)
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            if(doc.data().type === 'user'){
              callback({ // Callback ผู้ใช้งานทั่วไป
                type: '0',
                uid: doc.data().userid,
                fullname: doc.data().fname + ' ' + doc.data().lname,
                userType: doc.data().usertype,
                stuid: doc.data().stuid
              });
            }else{
              callback({ // Callback เจ้าหน้าที่ หรือ ผู้ดูแลระบบ
                type: '1',
                uid: doc.data().userid,
                fullname: doc.data().fname + ' ' + doc.data().lname,
                userType: doc.data().usertype,
                stuid: doc.data().stuid
              });
            }
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      queryDoc(data){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        for (let i = 0; i < this.items.length; i++) { // loop ทีละรายการ
          const docRef = firestore.collection('items');
          const query = docRef
            .where('item_code','==',this.items[i].item_code)
            .where('status','==','ใช้งาน')
          query
          .get()
          .then(snapshot =>{
            snapshot.forEach((doc) => {
              this.updateStatus(doc.id,this.items[i].room) // หากพบข้อมูล เรียกฟังก์ชัน update ส่ง id กับสถานที่เก็บปัจจุบันไป
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
        this.addBorrow(data); // เมื่ออัพเดตข้อมูลในตาราง items แล้ว เพิ่มข้อมูลรายการยืมที่ตาราง borrows
      },
      updateStatus(id,room_at){ // อัพเดต สถานที่เก็บปัจจุบัน ในตาราง items
        const item = firestore.collection('items');
        const query = item.doc(id)
        query
        .update({status:'ถูกยืม',room:room_at})
        .then(()=>{
          console.log('Updated Success!!');
        })
        .catch(err =>{
          console.log(err);
        });
      },
      addBorrow(data){ // เพิ่มข้อมูลรายการยืมในตาราง borrows
        const borrow = firestore.collection('borrows');
        borrow.add(data)
        .then(()=>{
          Swal.fire({
            title: 'บันทึกข้อมูลสำเร็จ',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              this.rmRequest((res) =>{
                if(res === 'success'){
                  liff.sendMessages([
                    {
                      'type' : 'text',
                      'text' : 'อนุมัติรายการยืมเรียบร้อยแล้วค่ะ'
                    }
                  ]).then(() => {
                    liff.closeWindow();
                  })
                }
              })
            }
          })
        })
        .catch(err => console.log(err));
      },
      rmRequest(id,callback){
        const docRef = firestore.collection('requestBorrow');
        const query = docRef.doc(id)
        query
        .delete()
        .then(()=>{
          callback('success');
        })
        .catch(err =>{
          console.log(err);
          callback('error');
        })
      },
      thaiDate(date,callback) {
        const arr1= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const arr2= ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน','กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

        for (let i=0; i<arr1.length; i++) {
          date = date.replace(arr1[i], arr2[i]);
        }
        date = date.replaceAll(',', '');
        const str = date.split(' ');
        callback(str[1] +' '+ str[0] +' '+ (parseInt(str[2])+543));
      }
    }
  }
</script>