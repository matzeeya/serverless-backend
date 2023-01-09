<template>
  <b-field label="ภาควิชา">
    <div class="select">
      <select id="department"
        name="department"
        v-model="department"
        @change="getDepartment(department)"
        style="width:280px">
          <option v-for="department in dep" 
            v-bind:key="department">
              {{department}}
            </option>
      </select>
    </div>
  </b-field>
</template>
<script>
import firestore from "../../../firebase-config/vue/firebase"
export default {
  name: 'Department',
  props:{
    getDepartment:Function
  },
  data () {
    return {
      dep: [],
      department:null
    }
  },
  created() {
    const query = firestore.collection("department").orderBy("name","asc")
    query.get().then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data()){
          this.dep.push(doc.data().name)
        }
      })
    })
  }
}
</script>