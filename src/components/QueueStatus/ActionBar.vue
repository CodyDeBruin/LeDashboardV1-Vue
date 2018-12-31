<template>
    <md-toolbar :class="'md-layout md-gutter'" v-if="fetchResponse">
           
            <CaptionedItem class="md-layout-item" :val="fetchResponse.metricsTotals.connectedEng.toFixed(0)" caption="Connected Chats"/>
            <CaptionedItem class="md-layout-item" :val="fetchResponse.metricsTotals.abandonedEng.toFixed(0)" caption="Abandoned Chats"/>
            <CaptionedItem class="md-layout-item" :val="SlotsAvail.toFixed(0)" caption="Current Available Slots"/>
            <CaptionedItem class="md-layout-item" :val="fetchResponse.metricsTotals.currentQueueSize.toFixed(0)" caption="Current Queue Size"/>     
            <CaptionedItem class="md-layout-item" :val="`${currentSLA.toFixed(2)}%`" caption="Service Level Since 5am"/>      
    </md-toolbar>  
</template>

<script>
import CaptionedItem from './CaptionedItem'
export default {
    name: 'action-bar',
    components:{
        CaptionedItem,
    },
    props:{
        fetchResponse: {type: Object },
        SlotsAvail: {type:Number},
        currentSLA: {type:[String, Number] },
    },
}

</script>

<style scoped>
    .md-toolbar {
        margin: 5px;
        padding: 5px;
    }
</style>