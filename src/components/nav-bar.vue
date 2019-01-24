<template>
  <nav class="navbar"> 
    <md-toolbar class="md-dense md-primary" md-elevation="7">

          <router-link to="/"><img src=""/></router-link>
          <h3 class="md-title" >Digital Chat Dashboard</h3>
          <div class="md-toolbar-section-end" v-if="this.$store.getters.isLoggedIn"> 

            <md-tabs class="md-primary" md-sync-route >
              <md-tab id="tab-home" md-label="Home" to="/"></md-tab>
              <md-tab id="tab-settings" md-label="Settings" to="/settings"></md-tab> 
            </md-tabs>

            <md-button class="md-dense md-raised" @click="logoutHandler">Logout</md-button>
          </div>
    </md-toolbar>
  </nav>
</template>


<script>
export default {
  name: 'appnavbar',
  data: () => ({

  }),
  components: {
  },
  methods: {

      async logoutHandler(e) {
          e.preventDefault()
             await this.$store.dispatch('attemptLogout').then( () => {this.$router.push("/login") })         
      }

  }
}
</script>

<style scoped>

</style>
