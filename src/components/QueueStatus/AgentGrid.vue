<template>
    <div class="md-elevation-2 agentGrid">
        <header>
            <h3>Agents on {{viewType}}</h3>
        </header>  
        <table>   
            <tr class="headerRow">
                <th>Agent</th>
                <th>Chats</th>
                <th>Max Chats</th>
            </tr>
            <tr v-for="(item,i) in fetchResponse" :key="i" :class="isAgentMaxxed(item)">
                <td>{{item['userName']}}</td>
                <td class="numericCell">{{item['chats']}}</td>
                <td class="numericCell">{{item['@maxChats']}}</td>
            </tr>
        </table> 
    </div>
</template>
<script>

export default {
    name: 'agentgrid',
    props:{
        fetchResponse: {type: Array }, //to display
        viewType: {type: String, default: 'Ready' },
    },
    data() {
        return ({
        })
    },
    // computed: {
    //     shouldDisplayTime: function() {
    //         return this.viewType == 'Not-Ready'
    //     },
    // },
    methods: {
        isAgentMaxxed(agent) {
            return this.viewType == 'Ready' && ( agent['chats'] >= agent['@maxChats'] ) ? "maxxedChat" : null
        },
    }

}
</script>

<style scoped>
.agentGrid{
    margin:5px;
    height: auto;
    white-space:pre;
    text-overflow: clip; 
}
header {
    text-align:center;
    line-height: 0em;
    border: 1px solid #dddddd; 
}
table {
    border-collapse: collapse;
    width: 100%;
}
.headerRow th {
    border: 1px solid #dddddd; 
    height: 2em;
    max-width: 100%;
}
tr {
    border-top: 1px solid #ddd;
    height: 1em;
    line-height: 0em;
    width: 100%;  
}
.numericCell {
    text-align: center;
}
.maxxedChat {
    border: 1px solid black;
    background-color: #ff5252;
    color:#dddddd; 
}
</style>