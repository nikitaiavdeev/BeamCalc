<template>
  <v-card outlined>
    <v-card-title dense>Panel</v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <svg id="canvas" width="100%" height="400px">
            <g v-for="(beam, index) in beams" :key="index"  class='beam'>
              <path  :d="getBeamRect(index)" fill="none" stroke-width="3px"/>
            </g>
          </svg>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapGetters  } from 'vuex'
  import mapStatesTwoWay from '../store/mapTwoWay'
  import '../scss/svg.scss'

  export default {
    computed:{
      ...mapState(['beams']),
      ...mapGetters(['getBeamRect']),
      ...mapStatesTwoWay({
        screen: state => state.screen,
      }, function (value) {
        this.$store.commit('updateCurrent', value)
      })
    },

    data: () => ({
    }),

    mounted: function() {
      window.addEventListener('resize', this.onResize);
      this.screen.MAX_X = document.getElementById('canvas').clientWidth;
    },

    beforeDestroy: function() { 
      window.removeEventListener('resize', this.onResize); 
    },

    methods: {
      onResize() {
        this.screen.MAX_X = document.getElementById('canvas').clientWidth;
      }
    }
  }
</script>

<style lang="scss" scoped>
   @import '../scss/svg.scss';
</style>