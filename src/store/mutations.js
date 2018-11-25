
export default {
    loginUser(state, pl) {
        //console.log("User logged in")
       state.currentLESession = pl
    },

    logoutUser(state) {
        //console.log("User logged out")
       if( state.currentLESession ) { clearInterval(state.currentLESession.status.refresh.refreshTimer) }
        state.currentLESession = null 
    },

}