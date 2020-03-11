<template>
    <v-snackbar v-model="snackbar.show" :top="top" :color="snackbar.color" :timeout="snackbar.timeout">
      {{snackbar.message}}
      <v-btn icon @click="snackbar.show = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
</template>

<script>
import mapStatesTwoWay from '../store/mapTwoWay'

export default {
    data: () => ({
        top: true,
    }),

    computed: {
      ...mapStatesTwoWay({
            snackbar: state => state.snackbar
        }, function (value) {
            this.$store.commit('updateCurrent', value)
        })
    },
}
</script>