<template>
  <div class='container-fluid'>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col' colspan='5'>คำขอรายการคืน</th>
          </tr>
          <tr>
            <th scope='col'>ลำดับ</th>
            <th scope='col'>รายการ</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>สภาพการใช้งาน</th>
            <th scope='col'>สถานที่เก็บ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item.name }}</td>
            <td>{{ item.item_code }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.room }}</td>
          </tr>
          <tr>
            <td colspan='5'><p>หมายเหตุ <u>{{ items.note }}</u></p></td>
          </tr>
          <tr v-for='user,index in users' :key='index'>
            <td colspan='3'>&nbsp;</td>
            <td colspan='2' ><p>ชื่อผู้คืน <u>{{ user.fullname }}</u></p></td>
          </tr>
          <tr>
            <td colspan='3'>&nbsp;</td>
            <td colspan='2' ><p>วันที่คืน <u>{{ items.created_at }}</u></p></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan='5'>
              <button class='button is-success' type='submit'>อนุมัติรายการคืน</button>
              <button class='button is-danger' @click='cancelHandler'>ไม่อนุมัติรายการคืน</button>
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

      const docRef = firestore.collection('requestReturn');
      const query = docRef
        .where('return_by','==',this.ureq)
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
                  'status': data.status,
                  'serial': res.serial,
                  'room': data.room,
                }
                arr.push(obj);
                arr['doc'] = doc.id;
                arr['note'] = doc.data().note;
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
        this.rmRequest(this.items.doc);
        liff.sendMessages([
          {
            'type' : 'text',
            'text' : 'ไม่อนุมัติรายการคืนค่ะ'
          }
        ]).then(() => {
          liff.closeWindow();
        });
      },
      itemName(id, callback){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',id)
          .where('status','==','ถูกยืม')
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
                return_by: this.ureq,
                note: this.items.note,
                created_at: new Date()
              };

              let item = [];
              for (let i = 0; i < this.items.length; i++) {
                item[i] = {
                  'item_code': this.items[i].item_code,
                  'room': this.items[i].room,
                  'status':this.items[i].status
                }
              }

              obj['items'] = item;

              this.rmRequest(this.items.doc);
              this.queryDoc(obj);
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
        for (let i = 0; i < this.items.length; i++) {
          const docRef = firestore.collection('items');
          const query = docRef
            .where('item_code','==',this.items[i].item_code)
            .where('status','==','ถูกยืม')
          query
          .get()
          .then(snapshot =>{
            snapshot.forEach((doc) => {
              this.queryBorrowData(this.items[i].item_code,this.items[i].room,doc.data().room); // query ค่าในตาราง borrow
              this.updateItemStatus(doc.id,this.items[i].room,this.items[i].status);
            });
          })
          .catch(err =>{
            console.log(err);
          });
        }
        this.addReturn(data); // เพิ่มรายการคืนลงในตาราง returns
      },
      queryBorrowData(id,room_at,room,callback){ // ค้นข้อมูลในตาราง borrows เพื่อคืนครุภัณฑ์
        let updateStatus = {};
        let obj = [];
      
        const docRef = firestore.collection('borrows');
        const query = docRef
          .where('items','array-contains',{
            'item_code': id,
            'room': room,
            'status': '0'
          });
        query
        .get()
        .then(snapshot =>{
          if(!snapshot.empty){ // หากพบข้อมูลสามารถคืนได้
            snapshot.forEach((doc) => {
              for(let i=0; i < doc.data().items.length; i++){ // loop จำนวนรายการยืมใน field items
                if(doc.data().items[i].item_code == id){ // ถ้า item_code ใน field ตรงกับ item_code ที่ต้องการคืน
                  obj[`${i}`] = { // เปลี่ยนค่าใน field ตามค่าที่รับเข้ามาใหม่
                    'item_code': id,
                    'room': room_at,
                    'status':'1'
                  }
                }else{ // ถ้า item_code ใน field ไม่ตรงกับ item_code ที่ต้องการคืน
                  obj[`${i}`] = { // คงค่าเดิมที่มีในตาราง borrows
                    'item_code': doc.data().items[i].item_code,
                    'room': doc.data().items[i].room,
                    'status': doc.data().items[i].status
                  }
                }
              }
              updateStatus['items'] = obj;
              this.updateBorrowStatus(doc.id,updateStatus,(res) => {
                if(res){
                  callback(true);
                  this.queryDoc();
                }
              }); // update สถานะในตาราง borrows
            });
          }else{ // หากไม่พบข้อมูลไม่สามารถคืนได้
            console.log('ไม่สามารถคืนรายการได้')
          }
        })
        .catch(err =>{
          console.log(err);
        }); 
      },
      updateBorrowStatus(id,data,res){ // update สถานะในตาราง borrows
        const docRef = firestore.collection('borrows');
        const query = docRef.doc(id)
        query
        .update(data)
        .then(()=>{
          console.log('Updated Borrows Status Success!! ');
          res(true);
          // this.updateItemStatus(itemid,this.room_at[i],this.itemStatus[i]);
        })
        .catch(err =>{
          console.log(err);
        });
      },
      updateItemStatus(id,room_at,state){
        const item = firestore.collection('items');
        const query = item.doc(id)
        query
        .update({status:state,room:room_at})
        .then(()=>{
          console.log('Updated Items Status Success!!');
        })
        .catch(err =>{
          console.log(err);
        });
      },
      addReturn(data){ // เพิ่มรายการคืนลงในตาราง returns
        const turn = firestore.collection('returns');
        turn.add(data)
          .then(()=>{
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success'
            }).then((result) => {
              if (result.isConfirmed) {
                this.rmRequest(this.items.doc);
                liff.sendMessages([
                  {
                    'type' : 'text',
                    'text' : 'อนุมัติรายการคืนเรียบร้อยแล้วค่ะ'
                  }
                ]).then(() => {
                  liff.closeWindow();
                })
              }
            })
          })
          .catch(err => console.log(err));
      },
      rmRequest(id){
        const docRef = firestore.collection('requestReturn');
        const query = docRef.doc(id)
        query
        .delete()
        .then(()=>{
          
        })
        .catch(err =>{
          console.log(err);
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