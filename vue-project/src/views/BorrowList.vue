<template>
  <div>
    <form @submit.prevent='submitHandler'>
      <table class='table table-striped'>
        <thead>
          <tr>
            <th scope='col'>ลำดับที่</th>
            <th scope='col'>หมายเลขครุภัณฑ์</th>
            <th scope='col'>สถานที่เก็บ</th>
            <th scope='col'>ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item,index in items' :key='index'>
            <th scope='row'>{{ index + 1 }}</th>
            <td>{{ item }}</td>
            <td><ListRoom :getAllRoom='getRoom'/></td>
            <td>
              <input 
                type='checkbox' 
                :id='key'
                :value='item'
                v-model='names[key]'>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">
              <button class='button is-success' type='submit'>ยืนยันรายการยืม</button>
            </td>
            <td colspan="2">
              <button class='button is-danger' type='button'>ยกเลิก</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </form>
  </div>
</template>
<script>
  const line = require('../../../line-config/config');
  import ListRoom from '../components/ListRoom.vue';

  export default {
    components: {
      ListRoom
    },
    data() {
      return {
        photo: 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG',
        code: this.$route.params.code,
        userProfile: null,
        items: [],
        room_at: null
      }
    },
    mounted(){
      const liff = this.$liff
      liff.init({
        liffId: line.liffID
      }).then(() => {
        console.log('LIFF initialize finished')
        if (liff.isLoggedIn()) {
          liff.getProfile()
          .then(profile => {
            this.userProfile = profile.userId;
          })
          .catch((err) => {
            console.error(err)
          })
        } else {
          console.log('LIFF is not logged in')
          liff.login()
        }
      }).catch((err) => {
        console.error('Error initialize LIFF: ', err)
      });
    },
    created() {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key.search('item:') >= 0){
          this.items.push(localStorage.getItem(key));
        }
      }
    },
    methods : {
      getRoom(room){
        this.room_at = room
      },
      async submitHandler(){
        
      }
    }
  }
</script>