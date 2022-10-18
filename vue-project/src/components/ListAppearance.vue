<template>
  <div class="select">
    <select id="appearance"
      name="appearance"
      v-model="appearance"
      @change="getAppearances(appearance)"
      style="width:180px">
        <option v-for="appearance in appearances" 
          v-bind:key="appearance">
            {{appearance}}
        </option>
    </select>
  </div>
</template>
<script>
export default {
  props:{
    getAppearances:Function
  },
  data () {
    return {
      appearances: {
        0:'ใช้งาน', 
        1:'ชำรุด', 
        2:'รอจำหน่าย' 
      },
      appearance: null
    }
  }
}
</script>