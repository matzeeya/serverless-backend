<template>
</template>
<script>
import firestore from '../../../firebase-config/vue/firebase';

export default {
  data() {
    return {
      items: [
        {'item_code':'7450-010-13402','room':'EE113'},
        {'item_code':'7450-010-13403','room':'EE113'},
        {'item_code':'7450-010-13404','room':'EE113'}
      ]
    }
  },
  created(){
    this.queryDoc();
  },
  methods:{
    checkBorrowStatus(eof,res){
      let code = this.items[eof].item_code;
      let room = this.items[eof].room
      const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',code)
          .where('status','==','แจ้งซ่อม')
        query
        .get()
        .then(snapshot =>{
          if(!snapshot.empty){
            const docRef = firestore.collection('repairs');
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
    queryDoc(){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
      for (let i = 0; i < this.items.length; i++) {
        const docRef = firestore.collection('items');
        const query = docRef
          .where('item_code','==',this.items[i].item_code)
          .where('status','==','แจ้งซ่อม')
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            this.queryBorrowData(this.items[i].item_code,this.items[i].room,doc.data().room,(res)=>{
              if(res){
                this.checkBorrowStatus(i,(res)=>{
                  if(res==='0'){
                    this.queryDoc();
                  }else{
                    // this.updateItemStatus(doc.id,this.items[i].room);
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
    },
    queryBorrowData(code,room_at,room,callback){ // ค้นข้อมูลในตาราง borrows เพื่อคืนครุภัณฑ์
      let updateStatus = {};
      let obj = [];
    
      const docRef = firestore.collection('repairs');
      const query = docRef
        .where('items','array-contains',{
          'item_code': code,
          'room': room,
          'status': '0'
        });
      query
      .get()
      .then(snapshot =>{
        if(!snapshot.empty){ // หากพบข้อมูลสามารถคืนได้
          snapshot.forEach((doc) => {
            for(let j=0; j < doc.data().items.length; j++){ // loop จำนวนรายการยืมใน field items
              if(doc.data().items[j].item_code == code){ // ถ้า item_code ใน field ตรงกับ item_code ที่ต้องการคืน
                obj[`${j}`] = { // เปลี่ยนค่าใน field ตามค่าที่รับเข้ามาใหม่
                  'item_code': code,
                  'room': room_at,
                  'status':'1'
                }
              }else{ // ถ้า item_code ใน field ไม่ตรงกับ item_code ที่ต้องการคืน
                obj[`${j}`] = { // คงค่าเดิมที่มีในตาราง borrows
                  'item_code': doc.data().items[j].item_code,
                  'room': doc.data().items[j].room,
                  'status': doc.data().items[j].status
                }
              }
            }
            updateStatus['items'] = obj;
            console.log('data ', updateStatus);
            this.updateBorrowStatus(doc.id,updateStatus,(res)=>{
              if(res){
                // console.log('queryBorrowData '+ doc.id);
                callback(true);
              }
            });
          });
        }else{ // หากไม่พบข้อมูลไม่สามารถคืนได้
          console.log('ไม่สามารถคืนรายการได้');
        }
      })
      .catch(err =>{
        console.log(err);
      }); 
    },
    updateBorrowStatus(id,data,res){ // update สถานะในตาราง borrows
      const docRef = firestore.collection('repairs');
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
    }
  }
}
</script>