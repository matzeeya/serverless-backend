<template>
  <div id="app">
    <p id="os"><b>OS:</b> </p>
    <p id="language"><b>Language:</b> </p>
    <p id="version"><b>Version:</b> </p>
    <p id="isInClient"><b>isInClient:</b> </p>
    <p id="accessToken"><b>AccessToken:</b> </p>
    <img id="pictureUrl">
    <p id="userId"><b>userId:</b> </p>
    <p id="displayName"><b>displayName:</b> </p>
    <p id="statusMessage"><b>statusMessage:</b> </p>
    <p id="decodedIDToken"><b>email:</b> </p>
    <p id="type"><b>type:</b> </p>
    <p id="viewType"><b>viewType:</b> </p>
    <p id="utouId"><b>utouId:</b> </p>
    <p id="roomId"><b>roomId:</b> </p>
    <p id="groupId"><b>groupId:</b> </p>
    <p id="friendship"><b>isFriendship:</b> </p>
    <p id="scanCode"><b>Code:</b> </p>
    <p id="isLoggedIn"><b>isLoggedIn:</b> </p>
    <p id="universalLink1"><b>Universal Link:</b> </p>
    <p id="universalLink2"><b>Universal Link with Query params:</b> </p>
  </div>
</template>
<script>
  export default {
    name: 'App',
    created() {
      userRegister.get().then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data()){
            // console.log(doc.id)
            console.log(doc.data().userid)
          }
        })
      })
    }
  }
</script>