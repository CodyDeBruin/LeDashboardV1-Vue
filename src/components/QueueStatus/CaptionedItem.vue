<template>
      <div class="md-elevation-2">
        <span class="md-title">{{(val).toFixed(0)}}</span><br/>
        <span class="md-body-1">{{caption}}</span>
      </div>
</template>

<script>
export default {
    name: 'agentStatusRow',
    props: {
      val: [String, Number],
      caption: String,
    },
  }
</script>

<style scoped>
  div{
    margin: 5px;
  }
</style>
