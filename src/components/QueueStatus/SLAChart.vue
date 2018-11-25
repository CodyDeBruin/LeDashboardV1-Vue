<template>
  <div class="md-elevation-2" v-if="fetchResponse">
          <GChart
            type="ColumnChart"
            :data="fetchResponseAsArrayData"
            :options="chartOptions"
          />  
  </div>   
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
    name: 'slachart',
    components:{
      GChart,
    },
    props:{
        fetchResponse: {type: Object, required:true }, 
        chatTimeBuckets: {type: Array, default: ()=>([5,10,15,20,30,60])},
    },
    data() {
      return {
        chartOptions: {
            title: `Digital Chat SLA - Current SL: ${(this.fetchResponse['0'].percentageFromTotal * 100).toFixed(2)}%`,
            hAxis: { title: `Service level time buckets since open (${process.env.VUE_APP_CHATDEPT_OPENHOUR}AM).`},
            vAxis: {}, //scaleType: 'mirrorLog'
          height:400,
        },
      }
    },
    computed: {
      fetchResponseAsArrayData: function() {
        let tempArray = [['Time Frame', 'Chats']]
        for(let bucket in this.fetchResponse) {
          tempArray.push([`> ${bucket} seconds`, this.fetchResponse[bucket].chats])
        }
        return tempArray
      }

    },
   
}
</script>

<style scoped>
  div {
    margin: 5px;
  }
</style>