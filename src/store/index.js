import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

//import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

// const vuexSStorage = new VuexPersistence({
//   storage: window.sessionStorage
// })

export default new Vuex.Store({
  state: { 
    currentLESession: null,
  },
  actions,
  mutations,
  getters,
  //plugins:[vuexSStorage.plugin]
})