<template>
  <div id="svg-toolTip" v-show="show"  :style="{top: locTop+'px', left: locLeft+'px'}">
      <span>{{inner}}</span>
  </div>
</template>

<script>
  export default {
    props: ['show', 'inner', 'locTop', 'locLeft'],
  }
</script>