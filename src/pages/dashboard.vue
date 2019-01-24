<template>
    <section> 
        <div class="md-layout md-alignment-top-center" v-if="this.fetchResponses.loaded">
            <ActionBar :class="'md-layout-item md-size-95 ' + kpiShouldBlink" :fetchResponse="fetchResponses.QueueHealth" :SlotsAvail="getAvailableSlots()" :currentSLA="getCurrentSLA()"/>
            <SLAChart class="md-layout-item md-size-30" :fetchResponse="fetchResponses.SlaHistogram.slaDataRange"/>
            <AgentGrid class="md-layout-item md-size" viewType='Ready' :fetchResponse="grabAgentsByGridType('Ready')"/>
            <AgentGrid class="md-layout-item md-size" viewType='Not-Ready' :fetchResponse="grabAgentsByGridType('Not-Ready')"/> 
        </div>
        <div v-else>
            <md-progress-spinner :v-if="!fetchResponses.loaded" :md-diameter="30" :md-stroke="6" md-mode="indeterminate"></md-progress-spinner>   
        </div>
    </section>
</template>


<script>
import SLAChart from '../components/QueueStatus/SLAChart'
import AgentGrid from '../components/QueueStatus/AgentGrid'
import ActionBar from '../components/QueueStatus/ActionBar'
export default {
  name: 'dashboard',
  components: {
    SLAChart,
    AgentGrid,
    ActionBar,
  },
  data() {
    return ({
            chatTimeBuckets: [5,10,15,20,30,60], // SLA API time buckets
            refreshTimer: null,
            lastRefresh: new Date(),
            fetchResponses: {
                QueueHealth: null,
                SlaHistogram: null,
                AvailableAgents: null,
                loaded:false,
            },
      })
  },
  created() {
      this.startFetches()
  },
  destroyed(){
      clearTimeout(this.refreshTimer)
  },
  computed: {
    kpiShouldBlink() {
        return ( this.fetchResponses.AvailableAgents && this.getAvailableSlots() == 0 ) ? "md-accent" : null
    },
  },
  methods: {
      async fetchLEData(url, action) {

            const reqContent = {
                  headers: {
                      "Content-Type": "application/json; charset=utf-8",
                      "Accept": "application/json",
                      "Authorization": "Bearer " + this.$store.getters.getBearer
                  },
              }
              const theReq = new Request(url, reqContent)
              return new Promise( async (resolve, reject) => { 
                await fetch(theReq) 
                  .then(async (res) => {
                      if(res.ok){
                          let responseJson = await res.json()     
                          
                                if( action == "AvailableAgents") { 
                                    responseJson = responseJson.availableAgents.agents.agent.map( val => { 
                                        val.chats = val.chats ? parseInt( val.chats ) : 0;
                                        val['@maxChats'] = val['@maxChats'] ? parseInt( val['@maxChats'] ) : 0;
                                        return val  
                                    })

                                    responseJson = responseJson.sort(function(a, b) {
                                        return a.chats - b.chats;
                                    })
                                }

                          this.fetchResponses[action] = responseJson
                          resolve(true)
                      }  else {reject(false)}
                  }) 
                  .catch ((err) => {reject(err) } )   
              })
      },
      
    async startFetches() {
          await Promise.all([
            this.fetchLEData(`https://${this.$store.getters.getCSDSDomain('leDataReporting')}/operations/api/account/${process.env.VUE_APP_LE_ACCOUNT}/queuehealth?timeframe=${this.getMinutesSinceOpen()}&v=1`,'QueueHealth'),
            this.fetchLEData(`https://${this.$store.getters.getCSDSDomain('leDataReporting')}/operations/api/account/${process.env.VUE_APP_LE_ACCOUNT}/sla?timeframe=${this.getMinutesSinceOpen()}&histogram=${this.chatTimeBuckets.toString()}&v=1`,'SlaHistogram'),
            this.fetchLEData(`${this.$store.getters.getAgentSessionLink}/availableAgents?&v=1&NC=true`,'AvailableAgents')] 
          ).then( () => {
                this.lastRefresh = new Date()
                this.fetchResponses.loaded = true
          }).catch( (err)=>console.log(err))


          //kick them to the login page if a refresh hasn't been sucessfull in the last 10 minutes.
          if( new Date().getMilliseconds > ( this.lastRefresh.getMilliseconds + (10 * 60 * 1000) )) {this.$router.push("/login")} 

            this.refreshTimer = setTimeout( () => {
                this.startFetches()   
            }, 10 * 1000) 
    },
    grabAgentsByGridType(type) {   
        const agArray= this.fetchResponses.AvailableAgents

        switch( type ) {
            case 'Ready':
                return agArray.filter( (val) => { return  val['@chatState'] == '2' } ); 
            case 'Not-Ready':
                return agArray.filter( (val) => { return ( val['@chatState'] == '3' || val['@chatState'] == '4' && val['@maxChats'] != 0 ) } ) 
            case 'Logged-in': 
                return agArray.filter( (val) => { return val['@chatState'] != '1'} )  
            default:
                return agArray.filter( (val) => { return val['@chatState'] == '2'} ); 
        }    
    },
    getAvailableSlots() {
        return this.grabAgentsByGridType('Ready').reduce( (acc, current) => {
            return acc + (current['@maxChats'] - current.chats)
        }, 0)
    },
    getCurrentSLA() {
        return ( this.fetchResponses.loaded && (this.fetchResponses.SlaHistogram.slaDataRange['0'].percentageFromTotal * 100) )
    },
    getMinutesSinceOpen() {
        let deptOpen = new Date();
            deptOpen.setHours( process.env.VUE_APP_CHATDEPT_OPENHOUR );
            deptOpen.setMinutes( 0 );
            deptOpen.setSeconds( 0 );
            deptOpen.setMilliseconds( 0 );
            return Math.round( ( new Date().getTime() - deptOpen.getTime() ) / 1000 / 60 );
    },
  }



}
</script>
<style scoped>
    .md-progress-spinner {
        padding: 10% 50%;
    }
</style>


