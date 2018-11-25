import LESession from '../session/LESession'

export default {
    async attemptLogin ({ commit }, pl) {

      const newSession = new LESession() 
      const attempt = await newSession.loginUser(pl.userName, pl.passWord)
            .then (() => {
                commit('loginUser', newSession )
               return {isLoggedIn:true}
            })
            .catch(() => ({isLoggedIn:false})) 

        return attempt
    
    },
    async attemptLogout ({ commit, state }) {
        
        if( state.currentLESession ) {

            const attempt = await state.currentLESession.logoutUser()
                .then( () => {
                    commit('logoutUser')
                    return {isLoggedIn:false}
                })
                .catch(() => ({isLoggedIn:true}) )

            return attempt
        } else { 
            commit('logoutUser')
            return {isLoggedIn:false}
         }
        
    },

}


