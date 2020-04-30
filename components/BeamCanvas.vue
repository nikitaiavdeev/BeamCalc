<template>
  <v-card outlined>
    <v-card-text>
      <v-row>
        <v-col>
          <svg id="canvas" width="100%" height="400px">
            <defs>
              <marker id="arrow-distrForce" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-distrForce-hover" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-force" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-force-hover" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
               <marker id="arrow-moment" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
               <marker id="arrow-moment-hover" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <g id="support">
                <path d="M 0,0 10,18 H -10 Z" stroke-width="0"/>
                <path d="M -12,18 H 12" stroke-width="2"/>
                <path d="M -8,19 H -6 L-10,24 H -12 Z" stroke-width="0"/>
                <path d="M -2,19 H 0 L -4,24 H -6 Z" stroke-width="0"/>
                <path d="M 4,19 H 6 L 2,24 H 0 Z" stroke-width="0"/>
                <path d="M 10,19 H 12 L 8,24 H 6 Z" stroke-width="0"/>
              </g>
            </defs>

            <g>
              <g class='beam' v-for="(section, index) in beams.sections" :key="'beam' + index" @click="editBeam(section)" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                <polygon  :points="section.polygonWhite" fill="white"/>
                <polygon  :points="section.polygonFill"/>
                <path  :d="section.path"/>
                <tooltip>
                  <span>Beam #{{index+1}}</span>
                  <span>Length {{section.length}} in</span>
                </tooltip>
              </g>
            </g>

            <g>
              <g v-for="(item, index) in loadBCs.items" :key="item.type + index">
                <g v-if="item.type === 'distributed force'" class="distrForce" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polygon  :points="item.path" stroke="none"/>
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{item.valA}} lb/in</text>
                  <text :x="item.textB.x" :y="item.textB.y">{{item.valB}} lb/in</text>
                  <tooltip>
                    <span>{{item.valA}} lb/in at {{item.locA}} in</span>
                    <span>{{item.valB}} lb/in at {{item.locB}} in</span>
                </tooltip>
                </g>
                <g v-if="item.type === 'force'" class="force" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{item.valA}} lb</text>
                  <tooltip>
                    <span>{{item.valA}} lb at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'moment'" class="moment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <path :d="item.path" />
                  <text :x="item.textA.x" :y="item.textA.y">{{item.valA}} lb-in</text>
                  <tooltip>
                    <span>{{item.valA}} lb-in at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'support'" class="support" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <use xlink:href="#support" :x="item.x" :y="item.y" /> 
                  <tooltip>
                    <span>simple support at {{item.locA}} in</span>
                  </tooltip>
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

  let t;

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
      editBeam (item) {
        this.$store.commit('editBeam', item);
      },
      onResize() {
        this.screen.maxX = document.getElementById('canvas').clientWidth - 2 * MARGIN_X;
        this.screen.maxY = document.getElementById('canvas').clientHeight- 2 * MARGIN_Y;
        this.updateBeamsSVG;
        this.updateLoadBCsSVG;
      },
      onHover(e) {
        t = setTimeout(() => {
          const caller = e.target.parentElement,
            rect = caller.getBoundingClientRect();
          this.toolTipInner = caller.getElementsByTagName('tooltip')[0].innerHTML;
          this.toolTipShow = true;
          this.toolTipTop = 0.5*(rect.top + rect.bottom);
          this.toolTipLeft = 0.5*(rect.left + rect.right);
        }, 1000);
      },
      onHoverCancel() {
        clearTimeout(t);
        this.toolTipShow = false;
      }
    }
  }
</script>

<style lang="scss">
   @import '../scss/svg.scss';
</style>