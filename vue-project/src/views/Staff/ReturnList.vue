<template>
  <div>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ลำดับที่</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>สถานที่เก็บ</th>
            <th scope='col'>สภาพการใช้งาน</th>
            <th scope='col'>ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item }}</td>
            <td>
              <ListRoom 
                :getAllRoom='getRoom'
                style='width:140px'/>
            </td>
            <td><ListAppearance :getAppearances='getState'/></td>
            <td>
              <input 
                type='checkbox' 
                :id='key'
                :value='item'
                v-model='delItem'
                @change='deleteItem'>
            </td>
          </tr>
          <tr>
            <td colspan='5'>
              <b-field label='หมายเหตุ'>
                <b-input 
                  type='textarea'
                  v-model='note' 
                  placeholder='หมายเหตุ...'>
                </b-input>
              </b-field>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan='3'>
              <button class='button is-success' type='submit'>ยืนยันรายการคืน</button>
            </td>
            <td colspan='2'>
              <button class='button is-danger' @click='cancelHandler'>ยกเลิก</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  </div>
</template>
<script>
  import Swal from 'sweetalert2'
  import ListAppearance from '../../components/ListAppearance.vue';
  import ListRoom from '../../components/ListRoom.vue';

  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');

  export default {
    components: {
      ListRoom,
      ListAppearance
    },
    data() {
      return {
        userProfile: null,
        itemStatus: [],
        items: [],
        delItem: [],
        room_at: [],
        note: null
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
    created() {
      for (let i = 0; i < localStorage.length; i++) { // loop หาเลขครุภัณฑ์
        const key = localStorage.key(i);
        if(key.search('item:') >= 0){
          this.items.push(localStorage.getItem(key)); // push เลขครุภัณฑ์ใน items
        }
      }
    },
    methods : {
      getRoom(room){ // เลือกห้องที่เก็บปัจจุบัน
        this.room_at.push(room);
      },
      getState(state){ // เลือกสภาพการใช้งาน
        this.itemStatus.push(state);
      },
      deleteItem(){ // เมื่อเลือก 'ลบ' ใน checkbok
        Swal.fire({
          title: 'เลขครุภัณฑ์: '+ this.delItem,
          text: 'ต้องการลบรายการใช่หรือไม่?',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          icon: 'question'
        }).then((result) => {
          if (result.isConfirmed) {
            let rm = 'item:' + this.delItem;
            localStorage.removeItem(rm);
            window.location.reload();
          }
        })
      },
      cancelHandler(){ // เมื่อคลิกปุ่ม ยกเลิก
        for (var i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if(key.search('item:') >= 0){
            localStorage.removeItem(key);
          }
        }
        liff.closeWindow();
      },
      async submitHandler(){
        if(this.items.length > 0){
          let obj = {
            return_by:this.userProfile,
            note: this.note,
            created_at: new Date()
          };

          let item = [];
          for (let i = 0; i < this.items.length; i++) {
            item[i] = {
              'item_code':this.items[i],
              'room':this.room_at[i],
              'status':this.itemStatus[i]
            }
          }

          obj['items'] = item;
          
          this.checkType((res) =>{
            if(res.type === '1'){
              this.queryDoc(obj);
            }else{
              this.requestReturn(obj) ;
            }
          })
        }else{
          Swal.fire({
            title: 'ผิดพลาด',
            text: 'กรุณาเพิ่มรายการครุภัณฑ์ก่อนค่ะ',
            icon: 'error'
          }).then((result) => {
            if (result.isConfirmed) {
              liff.closeWindow()
            }
          })
        }
      },
      checkType(callback){
        const docRef = firestore.collection('userRegister');
        const query = docRef
        .where('userid','==',this.userProfile)
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            if(doc.data().type === 'user'){
              callback({
                type: '0',
                uid: doc.data().userid
              });
            }else{
              callback({
                type: '1',
                uid: doc.data().userid
              });
            }
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      requestReturn(req){
        const docRef = firestore.collection('requestReturn');
        docRef.add(req)
        .then(()=>{
          Swal.fire({
            title: 'คืนครุภัณฑ์',
            text: 'ส่งคำขอรายการคืนครุภัณฑ์เรียบร้อยแล้วค่ะ',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
              liff.sendMessages([
              {
                'type' : 'text',
                'text' : 'ส่งคำขอคืนครุภัณฑ์'
              }
              ]).then(() => {
                this.cancelHandler();
              })
            }
          })
        })
        .catch(err => console.log(err));
      },
      checkBorrowStatus(eof,res){
        let code = this.items[eof].item_code;
        let room = this.items[eof].room
        const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',code)
          .where('status','==','ถูกยืม')
        query
        .get()
        .then(snapshot =>{
          if(!snapshot.empty){
            const docRef = firestore.collection('borrows');
            const query = docRef
              .where('items','array-contains',{
                'item_code': code,
                'room': room,
                'status': '1'
              });
            query
            .get()
            .then(snapshot =>{
              if(!snapshot.empty){
                res('1');
              }else{
                res('0');
              }
            });
          }else{
            console.log('ไม่สามารถคืนรายการได้');
          }
        });
      },
      queryDoc(data){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
        for (let i = 0; i < this.items.length; i++) {
          const docRef = firestore.collection('items');
          const query = docRef
            .where('item_code','==',this.items[i])
            .where('status','==','ถูกยืม')
          query
          .get()
          .then(snapshot =>{
            snapshot.forEach((doc) => {
              this.queryBorrowData(this.items[i],this.room_at[i],doc.data().room,(res)=>{
                if(res){
                  this.checkBorrowStatus(i,(res)=>{
                    if(res==='0'){
                      this.queryDoc();
                    }else{
                      this.updateItemStatus(doc.id,this.items[i].room,this.items[i].status);
                    }
                  });
                }
              }); // query ค่าในตาราง borrow
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
                  // console.log('queryBorrowData '+ doc.id);
                  callback(true);
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
          // console.log('update Borrow Status.' + id);
          res(true);
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
                liff.sendMessages([
                  {
                    'type' : 'text',
                    'text' : 'คืนเรียบร้อยแล้วค่ะ'
                  }
                ]).then(() => {
                  this.cancelHandler();
                })
              }
            })
          })
          .catch(err => console.log(err));
      }
    }
  }
</script>