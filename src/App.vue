<template>
    <div class="App"> 
      <!-- App content header -->
      <header> 
         <navbar />
      </header>

       <!-- APP content/Body -->
      <section>
            <router-view></router-view>
      </section>

    </div>
</template>

<script>
import navbar from './components/nav-bar.vue'

export default {
  name: 'app',
  components: {
    navbar
  },
  data: () => ({
    menuVisible: false,
    theme: 'md-theme-default'
  }),
  methods: {
  
  }
}
</script>

<style scoped>
  .md-app {
    min-height: 100%;
  }
</style>