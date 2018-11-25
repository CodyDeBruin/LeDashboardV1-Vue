<template>
    <md-toolbar :class="'md-layout md-gutter'" v-if="fetchResponse">
           
            <CaptionedItem class="md-layout-item" :val="fetchResponse.metricsTotals.connectedEng" caption="Connected Chats"/>
            <CaptionedItem class="md-layout-item" :val="fetchResponse.metricsTotals.abandonedEng" caption="Abandoned Chats"/>
            <CaptionedItem class="md-layout-item" :val="SlotsAvail" caption="Current Available Slots"/>
            <CaptionedItem class="md-layout-item" :val="fetchResponse.metricsTotals.currentQueueSize" caption="Current Queue Size"/>     
        <!-- <CaptionedItem v-for="(item, index, key) in fetchResponse.metricsTotals" :key="index" :val="item" :caption="index"/> -->
        
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
    },
}
</script>

<style scoped>
    .md-toolbar {
        margin: 5px;
        padding: 5px;
    }
</style>