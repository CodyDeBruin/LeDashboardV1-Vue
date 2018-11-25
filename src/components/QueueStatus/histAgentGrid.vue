<template>
  <div class="agentGrid" v-if="fetchResponse">
      <md-table v-model="fetchResponse" md-card>
            <md-table-toolbar class="md-dense md-primary">
                <h1 class="md-title"><b>Agents on {{viewType}} | Free Slots: </b></h1>
            </md-table-toolbar>
            <md-table-row slot="md-table-row" slot-scope="{ item }" > 
                <md-table-cell class="nameCell" md-label="Agent" >{{ item.userName }}</md-table-cell>
                <md-table-cell md-label="Current Chats" >{{ item.chats }}</md-table-cell>
                <md-table-cell md-label="Max Chats" >{{ item['@maxChats'] }}</md-table-cell>
            </md-table-row>
        </md-table>
  </div>   
</template>

<script>

export default {
    name: 'agentgrid',
    props:{
        fetchResponse: {type: Array }, //to display
        viewType: {type: String, default: 'Ready' },
    },
}
</script>

<style scoped>
.agentGrid{
    margin:5px;
}

.md-table .md-table-cell {
    width: 5px;
    min-width: 0px;
    height: 1em;
    line-height: 0em;
    white-space: nowrap;
    /* border: 1px solid black   */
}

.md-table .md-table-cell-container {
    padding: 0em 0em; 
}

.md-toolbar {
    min-height: 20px;
}
</style>