<template>
  <b-field label="คณะ">
    <div class="select">
      <select id="faculty"
        name="faculty"
        v-model="faculty"
        @change="getFaculty(faculty)"
        style="width:280px">
          <option v-for="faculty in facultys" 
            v-bind:key="faculty">
              {{faculty}}
            </option>
      </select>
    </div>
  </b-field>
</template>
<script>
import firestore from "../../../firebase-config/vue/firebase"
export default {
  name: 'Faculty',
  props:{
    getFaculty:Function
  },
  data () {
    return {
      facultys: [],
      faculty:null
    }
  },
  created() {
    const query = firestore.collection("faculty").orderBy("name","asc")
    query.get().then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data()){
          this.facultys.push(doc.data().name)
        }
      })
    })
  }
}
</script>