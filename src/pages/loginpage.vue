<template>
    <div class="md-layout"> 
       <loginForm class="md-layout-item md-size-60"/>
    </div>
</template>

<script>
import LoginForm from '../components/LoginForm'
export default {
  name: 'loginPage',
  components: {
    LoginForm,
  },
  data: () => ({
  }),
  methods: {
  }
}
</script>

<style scoped>
  div {
    margin: 2% 0;
  }
</style>