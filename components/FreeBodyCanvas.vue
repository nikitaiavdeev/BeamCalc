<template>
  <v-card outlined>
    <v-card-title dense>Free Body</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col>
          <svg id="freeBodyCanvas" width="100%" height="300px">
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
              <marker id="arrow-reactionF" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-reactionF-hover" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-reactionM" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
              <marker id="arrow-reactionM-hover" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
            </defs>

            <g>
              <g class='beam' v-for="(beam, index) in beams" :key="'beam' + index" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                <polygon  :points="beam.polygonFill"/>
                <path  :d="beam.path"/>
                <tooltip>
                  <span>Beam #{{index+1}}</span>
                  <span>Length {{beam.length}} in</span>
                </tooltip>
              </g>
            </g>

            <!-- Loads -->
            <g>              
              <g v-for="(item, index) in loads" :key="item.type + index">
                <g v-if="item.type === 'Distributed Force'" class="distrForce" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polygon  :points="item.path" stroke="none"/>
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb/in</text>
                  <text :x="item.textB.x" :y="item.textB.y">{{formatNum(item.valB)}} lb/in</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb/in at {{item.locA}} in</span>
                    <span>{{formatNum(item.valB)}} lb/in at {{item.locB}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Distributed Moment'" class="distrMoment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polygon  :points="item.path" stroke="none"/>
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb-in/in</text>
                  <text :x="item.textB.x" :y="item.textB.y">{{formatNum(item.valB)}} lb-in/in</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb-in/in at {{item.locA}} in</span>
                    <span>{{formatNum(item.valB)}} lb-in/in at {{item.locB}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Force'" class="force" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.valA)}} lb</text>
                  <tooltip>
                    <span>{{formatNum(item.valA)}} lb at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Moment'" class="moment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
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
                <g v-if="item.type === 'Support'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.rF)}} lb</text>
                  <tooltip>
                    <span>Reaction is {{formatNum(item.rF)}} lb at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Slide'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <path :d="item.path" />
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.rM)}} lb-in</text>
                  <tooltip>
                    <span>Reaction is {{formatNum(item.rM)}} lb-in at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Fixed'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.rF)}} lb</text>

                  <path :d="item.pathM" />
                  <text :x="item.textB.x" :y="item.textB.y">{{formatNum(item.rM)}} lb-in</text>
                  <tooltip>
                    <span>Reaction is {{formatNum(item.rF)}} lb and {{formatNum(item.rM)}} lb-in at {{item.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Linear Spring'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <polyline :points="item.path"/>
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.rF)}} lb</text>
                  <tooltip>                    
                    <span>Reaction is {{formatNum(item.rF)}} lb at {{item.locA}} in</span>
                    <span>Deflection is {{formatNum(item.rF/item.stiff)}} in</span>
                  </tooltip>
                </g>
                <g v-if="item.type === 'Torsion Spring'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <path :d="item.path" />
                  <text :x="item.textA.x" :y="item.textA.y">{{formatNum(item.rM)}} lb-in</text>
                  <tooltip>
                    <span>Reaction is {{formatNum(item.rM)}} lb-in at {{item.locA}} in</span>
                    <span>Section angle is {{formatNum(item.rM/item.angle)}} rad</span>
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
  import { mapState } from 'vuex'
  import { formatNumer } from '../general/helpers.js'
  import SVGToolTip from './SVGToolTip'

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
    },

    data: () => ({
      toolTipShow: false,
      toolTipInner: '',
      toolTipTop: 0,
      toolTipLeft: 0,
    }),

    methods: {
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