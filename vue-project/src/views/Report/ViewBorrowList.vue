<template>
  <div class='container-fluid'>
    <form @submit.prevent='submitHandler'>
      <button
        class='button is-success' 
        type='submit'>
        Export PDF
      </button>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col' colspan='5'>รายการยืม</th>
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
          <tr v-for='data,index in datas' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ data.name }}</td>
            <td>{{ data.item_code }}</td>
            <td>{{ data.serial }}</td>
            <td>{{ data.room }}</td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>
<script>
  import moment  from 'moment'
  import firestore from '../../../../firebase-config/vue/firebase';

  const line = require('../../../../line-config/config');

  export default {
    data() {
      return {
        userProfile: null,
        datas:[]
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished');
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
            this.borrowList();
          })
          .catch((err) => {
            console.error(err);
          })
        } else {
          console.log('LIFF is not logged in');
          liff.login();
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err);
      });
    },
    methods : {
      borrowList(){
        let obj = [];
        let arr = [];
        let m1 = moment();
        let m2 = moment();
        // m1.add(-1, 'days'); //yesterday
        // m2.add(-1, 'days'); //yesterday
        m1.startOf('day');
        m2.endOf('day');

        const docRef = firestore.collection('borrows');
        const query = docRef
          .where('borrow_by','==',this.userProfile)
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
                    'brand': res.brand,
                    'item_code': data.item_code,
                    'serial': res.serial,
                    'room': data.room,
                  }
                  arr.push(obj);
                  arr['reason'] = doc.data().reason;
                  index++; 
                }
              });
            }
            this.datas = arr;
          });
        })
        .catch(err =>{
          console.log(err);
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
              serial: doc.data().serial,
              brand: doc.data().brand
            })
          });
        })
        .catch(err =>{
          console.log(err);
        });
      },
      async submitHandler(){
        let user = [];
        let dateNow = moment().format('ll');
        let dateThai = '';
        this.thaiDate(dateNow, function(res) {
          dateThai = res;
        })

        // console.log('handler', this.datas);
        const docRef = firestore.collection('userRegister');
        const query = docRef
          .where('userid','==',this.userProfile)
        query
        .get()
        .then(snapshot =>{
          snapshot.forEach((doc) => {
            user = {
              'fname': doc.data().fname, 
              'lname': doc.data().lname,
              'usertype': doc.data().usertype,
              'stuid': doc.data().stuid,
              'faculty': 'วิศวกรรมศาสตร์',
              'department': 'ภาควิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์',
              'reason': this.datas.reason,
              'date': dateThai
            }
            localStorage.setItem("userData",JSON.stringify(user));
            localStorage.setItem("borrowList",JSON.stringify(this.datas));
            window.location.replace(line.liffUrl + '/exportborrow');
          });
        })
        .catch(err =>{
          console.log(err);
        });
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