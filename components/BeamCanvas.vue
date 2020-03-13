<template>
  <v-card outlined>
    <v-card-text>
      <v-row>
        <v-col>
          <svg xmlns="http://www.w3.org/2000/svg" id="canvas" width="100%" height="400px">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none" fill="context-stroke"/>
              </marker>
            </defs>

            <g v-for="(section, index) in beams.sections" :key="'beam' + index"  class='beam'>
              <polygon  :points="section.polygonWhite" fill="white"/>
              <polygon  :points="section.polygonFill"/>
              <path  :d="section.path"/>
            </g>

            <g v-for="(item, index) in loadBCs.items" :key="item.type + index"  class='loadBCs'>
              <g v-if="item.type === 'distributedForce'" calss="distrForce">
                <path  :points="item.path + 'z'"/>
                <path  :points="item.path" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
              </g>
            </g>
          </svg>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapState, mapMutations  } from 'vuex'
  import mapStatesTwoWay from '../store/mapTwoWay'
  import { MARGIN_X, MARGIN_Y } from '../store/store.js'
  import '../scss/svg.scss'

  export default {
    computed:{
      ...mapState(['beams', 'loadBCs']),
      ...mapMutations(['updateBeamsSVG', 'updateForcesSVG']),
      ...mapStatesTwoWay({
        screen: state => state.screen,
      }, function (value) {
        this.$store.commit('updateCurrent', value)
      })
    },

    data: () => ({
    }),

    mounted: function() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
        this.screen.maxX = document.getElementById('canvas').clientWidth - 2 * MARGIN_X;
        this.screen.maxY = document.getElementById('canvas').clientHeight- 2 * MARGIN_Y;
        this.updateBeamsSVG;
        this.updateLoadBCsSVG;
      })
    },

    beforeDestroy: function() { 
      window.removeEventListener('resize', this.onResize); 
    },

    methods: {
      onResize() {
        this.screen.maxX = document.getElementById('canvas').clientWidth - 2 * MARGIN_X;
        this.screen.maxY = document.getElementById('canvas').clientHeight- 2 * MARGIN_Y;
        this.updateBeamsSVG;
        this.updateLoadBCsSVG;
      }
    }
  }
</script>

<style lang="scss" scoped>
   @import '../scss/svg.scss';
</style>