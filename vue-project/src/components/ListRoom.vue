<template>
  <b-field label="สถานที่เก็บปัจจุบัน: ">
    <div class="select">
      <select id="allRoom"
        name="allRoom"
        v-model="allRoom"
        @change="getRoom(allRoom)"
        style="width:280px">
          <option v-for="allRoom in rooms" 
            v-bind:key="allRoom">
              {{allRoom}}
            </option>
      </select>
    </div>
  </b-field>
</template>
<script>
import firestore from "../../../firebase-config/vue/firebase"
export default {
  name: 'Room',
  props:{
    getAllRoom:Function
  },
  data () {
    return {
      rooms: [],
      allRoom:null
    }
  },
  created() {
    const room = firestore.collection("rooms").orderBy("name","asc")
    room.get().then(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data()){
          this.rooms.push(doc.data().name)
        }
      })
    })
  }
}
</script>