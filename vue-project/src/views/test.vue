<template>
</template>
<script>
import firestore from '../../../firebase-config/vue/firebase';

export default {
  data() {
    return {
      items: [
        {'item_code':'7450-010-13400','room':'EE113','status':'ใช้งาน'},
        {'item_code':'7450-010-13401','room':'EE113','status':'ใช้งาน'},
        {'item_code':'7450-010-13402','room':'EE113','status':'ใช้งาน'}
      ]
    }
  },
  created(){
    this.queryDoc();
  },
  methods:{
    queryDoc(){ // ค้นหาข้อมูลครุภัณฑ์ในตาราง item
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
            // this.updateItemStatus(doc.id,this.items[i].room,this.items[i].status);
          });
        })
        .catch(err =>{
          console.log(err);
        });
      }
    },
    queryBorrowData(code,room_at,room){ // ค้นข้อมูลในตาราง borrows เพื่อคืนครุภัณฑ์
      let updateStatus = {};
      let obj = [];
    
      const docRef = firestore.collection('borrows');
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
            for(let i=0; i < doc.data().items.length; i++){ // loop จำนวนรายการยืมใน field items
              if(doc.data().items[i].item_code == code){ // ถ้า item_code ใน field ตรงกับ item_code ที่ต้องการคืน
                obj[`${i}`] = { // เปลี่ยนค่าใน field ตามค่าที่รับเข้ามาใหม่
                  'item_code': code,
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
            this.updateBorrowStatus(doc.id, updateStatus);
          });
        }else{ // หากไม่พบข้อมูลไม่สามารถคืนได้
          console.log('ไม่สามารถคืนรายการได้');
        }
      })
      .catch(err =>{
        console.log(err);
      }); 
    },
    updateBorrowStatus(id,data){ // update สถานะในตาราง borrows
      const docRef = firestore.collection('borrows');
      const query = docRef.doc(id)
      query
      .update(data)
      .then(()=>{
        console.log('update Borrow Status.');
        this.queryDoc();
      })
      .catch(err =>{
        console.log(err);
      });
    },
    // updateItemStatus(id,room_at,state){
    //   const item = firestore.collection('items');
    //   const query = item.doc(id)
    //   query
    //   .update({status:state,room:room_at})
    //   .then(()=>{
    //     console.log('Updated Items Status Success!!');
    //   })
    //   .catch(err =>{
    //     console.log(err);
    //   });
    // }
  }
}
</script>