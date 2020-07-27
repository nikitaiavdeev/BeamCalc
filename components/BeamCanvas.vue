<template>
  <v-card outlined>
    <v-card-title dense>{{title}}</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col>
          <svg id="canvas" width="100%" :height="getGH" :alt="screenUpdate">
            <SVGDefs />

            <!-- Beams -->
            <g>
              <g class='beam' v-for="(b, i) in beams" :key="'beam' + i" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBeam(b)">
                <polygon :points="getPath('beam polygon', i)"/>
                <path :d="getPath('beam path', i)"/>
                <tooltip>
                  <span>Beam #{{ i + 1 }}</span>
                  <span>Length {{ b.length }} in</span>
                  <span>Modulus {{ b.modulus }} msi</span>
                  <span>Inertia {{ b.inertia }} in⁴</span>
                </tooltip>
              </g>
            </g>
            <!-- Beams -->

            <!-- Loads -->
            <g>              
              <g v-for="(f, i) in loads" :key="f.type + i">
                <g v-if="f.type === 'Distributed Force'" class="distrForce" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(f)">
                  <use :xlink:href="f.valA > 0 ? '#pos-dis-force' : '#neg-dis-force'" :x="getX(f.locA)" :y="getBeamY( Math.sign(f.valA) )" />
                  <text :x="getX(f.locA)" :y="getTextY(f.valA, 0.75, f.valB)">{{formatNum(f.valA)}} lb/in</text>

                  <use :xlink:href="f.valB > 0 ? '#pos-dis-force' : '#neg-dis-force'" :x="getX(f.locB)" :y="getBeamY( Math.sign(f.valB) )" />
                  <text :x="getX(f.locB)" :y="getTextY(f.valB, 0.75, f.valA)">{{formatNum(f.valB)}} lb/in</text>

                  <polygon :points="getPath('distributed polygon', f)"></polygon>

                  <tooltip>
                    <span>{{formatNum(f.valA)}} lb/in at {{f.locA}} in</span>
                    <span>{{formatNum(f.valB)}} lb/in at {{f.locB}} in</span>
                  </tooltip>
                </g>
                <g v-if="f.type === 'Distributed Moment'" class="distrMoment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(f)">
                  <use :xlink:href="f.valA > 0 ? '#pos-dis-moment' : '#neg-dis-moment'" :x="getX(f.locA)" :y="getBeamY(1)" />
                  <text :x="getX(f.locA)" :y="getTextY(f.valA, 0.75, f.valB)">{{formatNum(f.valA)}} lb-in/in</text>

                  <use :xlink:href="f.valB > 0 ? '#pos-dis-moment' : '#neg-dis-moment'" :x="getX(f.locB)" :y="getBeamY(1)" />
                  <text :x="getX(f.locB)" :y="getTextY(f.valB, 0.75, f.valA)">{{formatNum(f.valB)}} lb-in/in</text>

                  <polygon :points="getPath('distributed polygon', f)"></polygon>
                  <tooltip>
                    <span>{{formatNum(f.valA)}} lb-in/in at {{f.locA}} in</span>
                    <span>{{formatNum(f.valB)}} lb-in/in at {{f.locB}} in</span>
                  </tooltip>
                </g>
                <g v-if="f.type === 'Force'" class="force" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(f)">
                  <use :xlink:href="f.valA >= 0 ? '#pos-force' : '#neg-force'" :x="getX(f.locA)" :y="getBeamY( Math.sign(f.valA) )" />
                  <text :x="getX(f.locA)" :y="getTextY(f.valA, 1)">{{formatNum(f.valA)}} lb</text>
                  <tooltip>
                    <span>{{formatNum(f.valA)}} lb at {{f.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="f.type === 'Moment'" class="moment" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editLoad(f)">
                  <use :xlink:href="f.valA >= 0 ? '#pos-moment' : '#neg-moment'" :x="getX(f.locA)" :y="getY(0)" />
                  <text :x="getX(f.locA)" :y="getTextY(f.valA, 0.5)">{{formatNum(f.valA)}} lb-in</text>
                  <tooltip>
                    <span>{{formatNum(f.valA)}} lb-in at {{f.locA}} in</span>
                  </tooltip>
                </g>
              </g>
            </g>
            <!-- Loads -->

            <!-- Reactions -->
            <g v-if="title == 'Free Body'">
              <g v-for="(s, i) in supports" :key="s.type + i">
                <g v-if="s.type === 'Fixed' || s.type === 'Support' || s.type === 'Linear Spring'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <use :xlink:href="s.rF >= 0 ? '#pos-force' : '#neg-force'" :x="getX(s.locA)" :y="getBeamY( Math.sign(s.rF) )" />
                  <text :x="getX(s.locA)" :y="getTextY(s.rF, 1)">{{formatNum(s.rF)}} lb</text>
                  <tooltip>
                    <span>Reaction is {{formatNum(s.rF)}} lb at {{s.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="s.type === 'Fixed' || s.type === 'Slide' || s.type === 'Torsion Spring'" class="reaction" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel">
                  <use :xlink:href="s.rM >= 0 ? '#pos-moment' : '#neg-moment'" :x="getX(s.locA)" :y="getY(0)" />
                  <text :x="getX(s.locA)" :y="getTextY(s.rM, 0.5)">{{formatNum(s.rM)}} lb-in</text>
                  <tooltip> 
                    <span>Reaction is {{formatNum(s.rM)}} lb-in at {{s.locA}} in</span>
                  </tooltip>
                </g>
              </g>
            </g>
            <!-- Reactions -->

            <!-- Supports -->
            <g v-if="title == 'Beam'">
              <g v-for="(s, i) in supports" :key="s.type + i">
                <g v-if="s.type === 'Support'" class="support" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(s)">
                  <use xlink:href="#support" :x="getX(s.locA)" :y="getBeamY(1)" />
                  <tooltip>
                    <span>simple support at {{s.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="s.type === 'Slide'" class="slide" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(s)">
                  <use xlink:href="#slide" :x="getX(s.locA)" :y="getY(0)" /> 
                  <tooltip>
                    <span>slide support at {{s.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="s.type === 'Fixed'" class="fix" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(s)">
                  <use :xlink:href="s.locA < beamL / 2 ? '#fix-left' : '#fix-right'" :x="getX(s.locA)" :y="getY(0)" />
                  <tooltip>
                    <span>fixed at {{s.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="s.type === 'Linear Spring'" class="linSpring" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(s)">
                  <use xlink:href="#linSpring" :x="getX(s.locA)" :y="getBeamY(1)" /> 
                  <tooltip>
                    <span>linear spring {{s.stiff}} lb/in at {{s.locA}} in</span>
                  </tooltip>
                </g>
                <g v-if="s.type === 'Torsion Spring'" class="torSpring" @mouseover.native:="onHover" @mouseout.native:="onHoverCancel" @click="editBC(s)">
                  <use xlink:href="#torSpring" :x="getX(s.locA)" :y="getY(0)" /> 
                  <tooltip>
                    <span>torsion spring {{s.stiff}} lb-in/rad at {{s.locA}} in</span>
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
    <v-btn v-if="title == 'Beam'" color="primary" fab small dark absolute top right @click="expandCanvas">
      <v-icon v-if="!hideTables">mdi-arrow-expand-all</v-icon>
      <v-icon v-if="hideTables">mdi-arrow-collapse-all</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import { mapFields } from 'vuex-map-fields'
  import { formatNumer } from '../general/helpers.js'
  import SVGToolTip from './SVGToolTip'
  import SVGDefs from './SVGDefs'
  import '../scss/svg.scss'

  let t;

  export default {
    props: {
      title: String
    },

    components: {
      SVGToolTip,
      SVGDefs
    },

    computed:{ 
      ...mapState({
        beamL: state => state.analysis.totalLength,
        beams: state => state.analysis.beams,
        supports: state => state.analysis.supports, 
        loads: state => state.analysis.loads,
        screenUpdate: state => state.screenUpdate,
      }),
      ...mapFields({
        hideTables: 'hideTables'
      }),
      ...mapGetters(['getX', 'getY', 'getBeamY', 'getTextY', 'getGH', 'getPath']),
    },

    data: () => ({
      toolTipShow: false,
      toolTipInner: '',
      toolTipTop: 0,
      toolTipLeft: 0,
    }),

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
      expandCanvas(){
        this.hideTables = !this.hideTables;
        window.dispatchEvent(new Event('resize'));
      }
    }
  }
</script>