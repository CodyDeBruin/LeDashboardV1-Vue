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
                AvailableAgents: {AgentList:null, next:null},
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
        return ( this.fetchResponses.AvailableAgents.AgentList && this.getAvailableSlots() == 0 ) ? "md-accent" : null
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
            return fetch(theReq) 
                .then(async (res) => {
                    if(res.ok){ 
                        const resp = await res.json()
                    if( action ) {
                        this.fetchResponses[action] = resp
                    } else return resp
                    }  else {
                        return null
                    }
                    
                }) 
                .catch ((err) => {console.log(err) } )   
    },

    async fetchAvailableAgents() {
        //relational links not described in LE documentation. Subsequent hits to the API return only the changes that have occured since the first request. 
        const mappedResponse = this.fetchResponses.AvailableAgents
        const url = mappedResponse.AgentList ? 
                    `${mappedResponse.next}&v=1&NC=true` : 
                    `${this.$store.getters.getAgentSessionLink}/availableAgents?&v=1&NC=true`

        const avilAgent = await this.fetchLEData(url)
        const agentsReturned = avilAgent.availableAgents.agents

        this.fetchResponses.AvailableAgents.next = avilAgent.availableAgents.link['@href']

        if( agentsReturned && Array.isArray(agentsReturned.agent) ) {
                
            if( !this.fetchResponses.AvailableAgents.AgentList ) {
                
                
                let agentTree = {}

                agentsReturned.agent.forEach( (val) => {
                    agentTree[val['@id']] = val
                    delete agentTree[val['@id']]['@id']
                })

                this.fetchResponses.AvailableAgents.AgentList = agentTree
            } else {
                agentsReturned.agent.forEach( (val) => {
                    for( let key in val ) {
                        this.fetchResponses.AvailableAgents.AgentList[val['@id']][key] = val[key]
                    }
                })
            }


        } else {
            if(agentsReturned && agentsReturned.agent) {
                this.fetchResponses.AvailableAgents.AgentList[agentsReturned.agent['@id']] = agentsReturned.agent
                delete this.fetchResponses.AvailableAgents.AgentList[agentsReturned.agent['@id']]['@id']
            } 
        } 

    },

    async startFetches() {
          await Promise.all([
            this.fetchLEData(`https://${this.$store.getters.getCSDSDomain('leDataReporting')}/operations/api/account/${process.env.VUE_APP_LE_ACCOUNT}/queuehealth?timeframe=${this.getMinutesSinceOpen()}&v=1`, 'QueueHealth'),
            this.fetchLEData(`https://${this.$store.getters.getCSDSDomain('leDataReporting')}/operations/api/account/${process.env.VUE_APP_LE_ACCOUNT}/sla?timeframe=${this.getMinutesSinceOpen()}&histogram=${this.chatTimeBuckets.toString()}&v=1`, 'SlaHistogram'),
            this.fetchAvailableAgents()] 
          ).then( () => {
                this.lastRefresh = new Date()
                this.fetchResponses.loaded = true
          }).catch( (err)=>console.log("Fetches failed: ", err))

          //kick them to the login page if a refresh hasn't been sucessfull in the last 10 minutes.
          if( new Date().getMilliseconds > ( this.lastRefresh.getMilliseconds + (10 * 60 * 1000) )) {this.$router.push("/login")} 

            this.refreshTimer = setTimeout( () => {
                this.startFetches()   
            }, 15 * 1000) 
    },

    grabAgentsByGridType(type) {   


        if(!this.fetchResponses.loaded) return null
        let agArray= Object.values(this.fetchResponses.AvailableAgents.AgentList)
        
        switch( type ) {
            case 'Ready':
                agArray = agArray.filter( (val) => { return  val['@chatState'] == '2' } ); 
                break
            case 'Not-Ready':
                agArray = agArray.filter( (val) => { return ( val['@chatState'] == '3' || val['@chatState'] == '4' && val['@maxChats'] != "0" ) } ) 
                break
            case 'Logged-in': 
                agArray = agArray.filter( (val) => { return val['@chatState'] != '1'} )  
                break
            default:
                agArray = agArray.filter( (val) => { return val['@chatState'] == '2'} ); 
                break
        }   

        return agArray.map( val => { 
            val.chats = val.chats ? parseInt( val.chats ) : 0;
            val['@maxChats'] = val['@maxChats'] ? parseInt( val['@maxChats'] ) : 0;
            return val  
        }).sort(function(a, b) {
            return a.chats - b.chats;
        }) 
          
    },

    getAvailableSlots() {
        return this.fetchResponses.loaded && this.grabAgentsByGridType('Ready').reduce( (acc, current) => {
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


