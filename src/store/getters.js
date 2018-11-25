export default {
    isLoggedIn: state => {
      return (state.currentLESession != null)
    },
    getBearer: state => {
      return (state.currentLESession && state.currentLESession.status.session.bearer)
    },
    getAgentSessionLink: state => {
      const agentSess = state.currentLESession
      return (agentSess && agentSess.status.session.chatAPISession)
    },
    getCSDSDomain: state => { return (action) => {
      return state.currentLESession && state.currentLESession.getCSDSDomain(action)
    }},
}