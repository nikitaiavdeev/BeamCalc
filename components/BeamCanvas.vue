<template>
  <v-card outlined>
    <v-card-text>
      <v-row>
        <v-col>
          <svg id="canvas" width="100%" height="400px">
            <defs>
              <marker id="arrow-distrForce" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-distrForce-hover" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
            </defs>
            <g>
              <g class='beam' v-for="(section, index) in beams.sections" :key="'beam' + index" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                <polygon  :points="section.polygonWhite" fill="white"/>
                <polygon  :points="section.polygonFill"/>
                <path  :d="section.path"/>
                <tooltip>
                  <span>Beam # : {{index+1}}</span>
                  <span>Area A : {{section.areaA}} in²</span>
                  <span>Area B : {{section.areaB}} in²</span>
                </tooltip>
              </g>
            </g>

            <g>
              <g v-for="(item, index) in loadBCs.items" :key="item.type + index">
                <g v-if="item.type === 'distributed force'" class="distrForce">
                  <polygon  :points="item.path" stroke="none"/>
                  <polyline :points="item.path"/>
                </g>
              </g>
            </g>
          </svg>
        </v-col>
      </v-row>
    </v-card-text>
    <SVGToolTip :show='toolTipShow' :inner='toolTipInner' :locTop='toolTipTop' :locLeft='toolTipLeft'/>
  </v-card>
</template>

<script>
  import { mapState, mapMutations  } from 'vuex'
  import mapStatesTwoWay from '../store/mapTwoWay'
  import { MARGIN_X, MARGIN_Y } from '../store/store.js'
  import SVGToolTip from './SVGToolTip'
  import '../scss/svg.scss'

  export default {
    components: {
      SVGToolTip
    },

    computed:{
      ...mapState(['beams', 'loadBCs']),
      ...mapMutations(['updateBeamsSVG', 'updateLoadBCsSVG']),
      ...mapStatesTwoWay({
        screen: state => state.screen,
      }, function (value) {
        this.$store.commit('updateCurrent', value)
      })
    },

    data: () => ({
      toolTipShow: false,
      toolTipInner: '',
      toolTipTop: 0,
      toolTipLeft: 0,
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
      },
      onHover(e) {
        const caller = e.target.parentElement,
          rect = caller.getBoundingClientRect();
        this.toolTipInner = caller.getElementsByTagName('tooltip')[0].innerHTML;
        this.toolTipShow = true;
        this.toolTipTop = 0.5*(rect.top + rect.bottom);
        this.toolTipLeft = 0.5*(rect.left + rect.right);
      },
      onHoverCancel() {
        this.toolTipShow = false;
      }
    }
  }
</script>

<style lang="scss">
   @import '../scss/svg.scss';
</style>