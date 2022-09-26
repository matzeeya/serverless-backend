<template>
  <div id="ViewData">
    <p>{{ item_code }}</p>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    name: 'ViewData',
    data() {
      return {
        item_code: this.$route.params.code,
        item: []
      }
    },
    mounted(){
      axios.get('https://tools.ecpe.nu.ac.th/inventory/api/item/' + this.item_code)
      .then((doc) => {
        const item = doc.data[0];
        console.log(item.name);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
</script>