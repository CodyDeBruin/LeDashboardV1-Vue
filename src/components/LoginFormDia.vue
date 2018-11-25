<template>
  <div class="LoginLEDia">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Login</md-dialog-title>
        <md-dialog-content class="interiorDia"> 

          <form id="createProduct"  @submit="clickHandler">

              <md-field>
                <label>UserName</label>
                <md-input required v-model="userName"></md-input>
              </md-field>

              <md-field>
                <label>Password</label>
                <md-input required type="password" v-model="passWord"></md-input>
              </md-field>
          
            <md-dialog-actions>
              <md-button class="md-primary md-raised" @click="showDialog = false">Cancel</md-button>
              <md-button class="md-primary md-raised" type="submit">Login</md-button>
            </md-dialog-actions>

            <md-snackbar md-position="center" :md-active.sync="warningShow">
                <span>{{this.warningText}}</span>
                <md-button class="md-primary" @click="warningShow = false">Close</md-button>
            </md-snackbar>

          </form>  
            </md-dialog-content>
    </md-dialog>
        
    <md-button class="md-raised" @click="showDialog = true">Create a new User</md-button>

  </div>
</template>

<script>

export default {
    name: 'CreateCard',
    data() { return{ 
      showDialog: false,
      userName:'',
      passWord:'',
      warningShow:false,
      warningText:'test',}
    },
    methods: {
     async clickHandler() {

          const myURL = `${API_URL}/users/`
          const reqContent = {
            method: "POST",
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify({username: this.named, emailaddress:this.email, password: this.password})
          }

          let theReq = new Request(myURL, reqContent)

         await fetch(theReq) 
              .then(res => {return res.json()})
              .then ( res => {
                        if ( !res.status ) {
                            this.warningShow = true  
                            this.warningText = res.msg
                        }})
              .catch ()
      
      if( this.warningShow ) {
        return 
      }

      this.named =''
      this.password =''
       
      this.showDialog = false
      this.warningShow = false
       
      }
    }
  }
</script>
