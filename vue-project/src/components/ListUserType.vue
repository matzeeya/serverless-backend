<template>
  <b-field label="สิทธิผู้ใช้งาน">
  <div class="select">
    <select id="usertype"
      name="usertype"
      v-model="usertype"
      @change="getUserType(usertype)"
      style="width:280px">
        <option v-for="usertype in types" 
          v-bind:key="usertype">
            {{usertype}}
        </option>
    </select>
  </div>
</b-field>
</template>
<script>
export default {
  props:{
    getUserType:Function
  },
  data () {
    return {
      types: {
        0:'user', 
        1:'staff', 
        2:'admin' 
      },
      usertype: null
    }
  }
}
</script>