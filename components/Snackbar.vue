<template>
  <v-snackbar v-model="snackbar.show" :top="top" :color="snackbar.color" :timeout="snackbar.timeout" wrapper-min-width="200px">
    {{snackbar.message}}
    <v-btn icon @click="snackbar.show = false">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  import { mapFields } from 'vuex-map-fields'

  export default {
    data: () => ({
      top: true,
    }),

    computed: {
      ...mapFields({
          snackbar: 'snackbar'
      })
    },
  }
</script>