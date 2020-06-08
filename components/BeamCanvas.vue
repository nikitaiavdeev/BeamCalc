<template>
  <v-card outlined>
    <v-card-title dense>Beam</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col>
          <svg id="canvas" width="100%" height="250px">
            <defs>
              <marker id="arrow-distrForce" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-distrForce-hover" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-distrMoment" viewBox="0 0 20 10" refX="18" refY="5" markerWidth="12" markerHeight="6" orient="auto-start-reverse">
                <path d="M10,0L20,5L10,10z" stroke="none"/>
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-distrMoment-hover" viewBox="0 0 20 10" refX="18" refY="5" markerWidth="12" markerHeight="6" orient="auto-start-reverse">
                <path d="M10,0L20,5L10,10z" stroke="none"/>
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-force" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-force-hover" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
               <marker id="arrow-moment" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
               <marker id="arrow-moment-hover" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
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
              <g id="slide">
                <path d="M -6,-20 V 20" stroke-width="3"/>
                <path d="M 6,-20 V 20" stroke-width="3"/>
                <circle cx="0" cy="-10" r="5" stroke-width="0"/>
                <circle cx="0" cy="10" r="5" stroke-width="0"/>
              </g>
              <g id="fix-left">
                <path d="M 0,-20 V 20" stroke-width="4"/>
                <path d="M -2,-20 v 2 L-10,-10 v -2 Z" stroke-width="0"/>
                <path d="M -2,-10 v 2 L-10,0 v -2 Z" stroke-width="0"/>
                <path d="M -2,0 v 2 L-10,10 v -2 Z" stroke-width="0"/>
                <path d="M -2,10 v 2 L-10,20 v -2 Z" stroke-width="0"/>
              </g>
              <g id="fix-right">
                <path d="M 0,-20 V 20" stroke-width="4"/>
                <path d="M 2,-20 v 2 L10,-10 v -2 Z" stroke-width="0"/>
                <path d="M 2,-10 v 2 L10,0 v -2 Z" stroke-width="0"/>
                <path d="M 2,0 v 2 L10,10 v -2 Z" stroke-width="0"/>
                <path d="M 2,10 v 2 L10,20 v -2 Z" stroke-width="0"/>
              </g>
              <g id="linSpring">
                <polyline points="0,-2 0,3 -12,8 12,13 0,18 0,23"  style="fill:none;stroke-width:2;stroke-linejoin:bevel"/>
                <path d="M -12,23 H 12" stroke-width="2"/>
                <path d="M -8,24 H -6 L-10,29 H -12 Z" stroke-width="0"/>
                <path d="M -2,24 H 0 L -4,29 H -6 Z" stroke-width="0"/>
                <path d="M 4,24 H 6 L 2,29 H 0 Z" stroke-width="0"/>
                <path d="M 10,24 H 12 L 8,29 H 6 Z" stroke-width="0"/>
              </g>
              <g id="torSpring">
                <path d="M0,0C-0.25,3.34 -3.92,1.92 -4.6,-0.34 -5.59,-3.65 -2.6,-6.61 0.52,-6.97 4.98,-7.49 8.66,-3.64 8.89,0.66 9.18,6.08 4.5,10.45 -0.78,10.57 -7.06,10.7 -12.06,5.25 -12.08,-0.89 -12.1,-7.96 -5.94,-13.55 1,-13.48 8.79,-13.4 14.93,-6.58 14.78,1.1 14.62,9.57 7.19,16 0,16" style="fill:none;stroke-width:2"/>
                <path d="M -12,16 H 12" stroke-width="2"/>
                <path d="M -8,17 H -6 L-10,22 H -12 Z" stroke-width="0"/>
                <path d="M -2,17 H 0 L -4,22 H -6 Z" stroke-width="0"/>
                <path d="M 4,17 H 6 L 2,22 H 0 Z" stroke-width="0"/>
                <path d="M 10,17 H 12 L 8,22 H 6 Z" stroke-width="0"/>
              </g>
            </defs>

            <g>
              <g class='beam' v-for="(beam, index) in beams" :key="'beam' + index" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBeam(beam)">
                <polygon :points="beam.polygonFill"/>
                <path :d="beam.path"/>
                <tooltip>
                  <span>Beam #{{ index + 1 }}</span>
                  <span>Length {{ beam.length }} in</span>
                  <span>Modulus {{ beam.modulus }} msi</span>
                  <span>Inertia {{ beam.inertia }} in⁴</span>
                </tooltip>
              </g>
            </g>

            <!-- Loads -->
            <g>              
              <g v-for="(item, index) in loads" :key="item.type + index">
                <g v-if="item.type === 'Distributed Force'" class="distrForce" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(item)">
                  <polygon  :points="item.path" stroke="none"/>
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb/in</text>
                  <text :x="item.textB.x" :y="item.textB.y">{{formatNum(item.valB)}} lb/in</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb/in at {{item.locA}} in</span>
                    <span>{{formatNum(item.valB)}} lb/in at {{item.locB}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Distributed Moment'" class="distrMoment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(item)">
                  <polygon  :points="item.path" stroke="none"/>
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb-in/in</text>
                  <text :x="item.textB.x" :y="item.textB.y">{{formatNum(item.valB)}} lb-in/in</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb-in/in at {{item.locA}} in</span>
                    <span>{{formatNum(item.valB)}} lb-in/in at {{item.locB}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Force'" class="force" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(item)">
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Moment'" class="moment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(item)">
                  <path :d="item.path" />
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb-in</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb-in at {{item.locA}} in</span>
                  </tooltip>
                </g>
              </g>
            </g>
            <!-- Loads -->

            <!-- Supports -->
            <g>
              <g v-for="(item, index) in supports" :key="item.type + index">
                <g v-if="item.type === 'Support'" class="support" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(item)">
                  <use xlink:href="#support" :x="item.x" :y="item.y" /> 
                  <tooltip>
                    <span>simple support at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Slide'" class="slide" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(item)">
                  <use xlink:href="#slide" :x="item.x" :y="item.y" /> 
                  <tooltip>
                    <span>slide support at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Fixed'" class="fix" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(item)">
                  <use v-if="item.isLeft" xlink:href="#fix-left" :x="item.x" :y="item.y" />
                  <use v-if="!item.isLeft" xlink:href="#fix-right" :x="item.x" :y="item.y" /> 
                  <tooltip>
                    <span>fixed at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Linear Spring'" class="linSpring" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(item)">
                  <use xlink:href="#linSpring" :x="item.x" :y="item.y" /> 
                  <tooltip>
                    <span>linear spring {{item.stiff}} lb/in at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Torsion Spring'" class="torSpring" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(item)">
                  <use xlink:href="#torSpring" :x="item.x" :y="item.y" /> 
                  <tooltip>
                    <span>torsion spring {{item.stiff}} lb-in/rad at {{item.locA}} in</span>
                  </tooltip>
                </g>
              </g>
            </g>
            <!-- Supports -->
          </svg>
        </v-col>
      </v-row>
    </v-card-text>
    <SVGToolTip :show='toolTipShow' :inner='toolTipInner' :locTop='toolTipTop' :locLeft='toolTipLeft'/>
  </v-card>
</template>

<script>
  import { mapState, mapMutations  } from 'vuex'
  import { MARGIN_X, MARGIN_Y } from '../store/store.js'
  import { formatNumer } from '../general/helpers.js'
  import mapStatesTwoWay from '../store/mapTwoWay'
  import SVGToolTip from './SVGToolTip'
  import '../scss/svg.scss'

  let t;

  export default {
    components: {
      SVGToolTip
    },

    computed:{
      ...mapState({
        beams: state => state.analysis.beams,
        supports: state => state.analysis.supports, 
        loads: state => state.analysis.loads
      }),
      ...mapMutations(['updateBeamsSVG', 'updateLoadBCsSVG', 'updateQMVSVG']),
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
        this.toolTipTop ++; //forceUpdate
      })
    },

    beforeDestroy: function() { 
      window.removeEventListener('resize', this.onResize); 
    },

    methods: {
      editBeam (item) {
        this.$store.commit('editBeam', item);
      },
      editLoad (item) {
        this.$store.commit('editLoad', item);
      },
      editBC (item) {
        this.$store.commit('editBC', item);
      },
      onResize() {
        this.screen.maxX = document.getElementById('canvas').clientWidth - 2 * MARGIN_X;
        this.screen.maxY = document.getElementById('canvas').clientHeight- 2 * MARGIN_Y;
        this.updateBeamsSVG;
        this.updateLoadBCsSVG;
        this.updateQMVSVG;
        this.toolTipTop ++;//forceUpdate
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
      },
      formatNum(inp) {
        return formatNumer(inp);
      },
    }
  }
</script>