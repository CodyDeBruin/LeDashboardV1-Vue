<template>
      <md-card>
       <form @submit="subHandler"> 
        <md-card-header>
          <div class="md-title">LiveEngage Login</div>
        </md-card-header>

        <md-card-content>
            
                <md-field>
                  <label>Username</label>
                  <md-input v-model="formData.userName" required></md-input>
                </md-field>

                <md-field :md-toggle-password="false">
                  <label>Password</label>
                  <md-input v-model="formData.passWord" type="password" required></md-input>
                </md-field>  
          
        </md-card-content>

        <md-card-actions>
          <md-button type="submit" class="md-primary md-raised">Sign in</md-button>
        </md-card-actions>

            <md-snackbar md-position="center" :md-active.sync="responseDidErr">
                <span>Login failed. Please try entering your credentials again or contact an administrator.</span>
                <md-button class="md-primary" @click="responseDidErr = false">Close</md-button>
            </md-snackbar>

        </form>
      </md-card>

</template>


<script>
export default {
  name: 'loginForm',
  data() {
    return ({

      formData: {
        passWord:'',
        userName:'',
      },
      responseDidErr:null
    })
  },
  methods: {
    async subHandler(e) {
          e.preventDefault()      
            const theResp = await this.$store.dispatch('attemptLogin', this.formData)
            theResp.isLoggedIn ? this.$router.push("/") : this.responseDidErr = true
      }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-card {
    margin:auto;
  }
</style>