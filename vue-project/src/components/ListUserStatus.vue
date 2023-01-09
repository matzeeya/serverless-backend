<template>
  <div class="select">
    <select id="usertype"
      name="usertype"
      v-model="usertype"
      @change="getUserStatus(usertype)"
      style="width:180px">
        <option v-for="usertype in types" 
          v-bind:key="usertype">
            {{usertype}}
        </option>
    </select>
  </div>
</template>
<script>
export default {
  props:{
    getUserStatus:Function
  },
  data () {
    return {
      types: {
        0:'Not Active', 
        1:'Actice'
      },
      usertype: null
    }
  }
}
</script>