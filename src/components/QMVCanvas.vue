<template>
  <v-row dense>
    <v-col>
      <svg :id="graphID" width="100%" :height="getGH + 'px'" :alt="screenUpdate" @mousemove="onHover" @mouseleave ="onHoverCancel">
        <SVGDefs />

        <!-- Graph -->
        <g>
          <path :d="getGraphPath(graph)"/>  
        </g>
        <!-- Graph -->

        <!-- Beam -->
        <line class = "beam"
            :x1="getX(0)" :y1="getGaphY(0, graph)" :x2="getX(beamL)" :y2="getGaphY(0, graph)"/>
        <!-- Beam -->

        <!-- Label -->
        <text class = "yAxisTitle" dy="-0.50em"
          :x="getX(0) + 2 * getTL" :y="getGaphY(graph.graphMax, graph)">
          {{getYLabel}}
        </text>
        <!-- Label -->

        <!-- Axis -->
        <g class = "axises" v-if="showAxis">
          <!-- Y -->
          <line class = "yAxis"
            :x1="getX(0)" :y1="getGaphY(graph.graphMin, graph)" :x2="getX(0)" :y2="getGaphY(graph.graphMax, graph)"/>
          <!-- X -->
          <line class = "xAxis"
            :x1="getX(0)" :y1="getGaphY(0, graph)" :x2="getX(beamL) + getMX * 0.5" :y2="getGaphY(0, graph)"/>
          <text class = "xAxisTitle" dominant-baseline = "baseline"
            :x="getX(beamL) + getMX * 0.5" :y="getGaphY(0, graph) - 3 * getTL">
              x, (in)
          </text>

          <g v-for="i in getGS + 1" :key="i">
            <!-- Y -->
            <line
              :x1="getX(0) - getTL" :y1="getGaphY(graph.graphMin + graph.step * (i - 0.5), graph)" 
              :x2="getX(0)" :y2="getGaphY(graph.graphMin + graph.step * (i - 0.5), graph)" />
            <text class = "yAxisText" dy="0.25em"
              :x="getX(0) - 1.5 * getTL " :y="getGaphY(graph.graphMin + graph.step * (i - 0.5), graph)">
                {{formatNum( graph.graphMin + graph.step * (i - 0.5) )}}
            </text>

            <!-- X -->
            <line
              :x1="getX(beamL * i / getGS)" :y1="getGaphY(0, graph)" 
              :x2="getX(beamL * i / getGS)" :y2="getGaphY(0, graph) + getTL" />
            <text class = "xAxisText" dy="0.50em"
              :x="getX(beamL * i / getGS) " :y="getGaphY(0, graph) + 2 * getTL">
                {{formatNum( beamL * i / getGS )}}
            </text>
          </g>
        </g>
        <!-- Axis -->

        <!-- Max/Min -->
        <g v-if="showMaxMin">
          <text class = "textMaxMin" dy="-0.30em"
            :x="getX(graph.max.x)" :y="getGaphY(graph.max.y, graph) - getTL/2">
            {{formatNum( graph.max.y )}}
          </text>
          <text class = "textMaxMin" dy="0.80em"
            :x="getX(graph.min.x)" :y="getGaphY(graph.min.y, graph) + getTL/2">
            {{formatNum( graph.min.y )}}
          </text>
        </g>

        <!-- Loads -->
        <g v-if="showLoads">
          <g v-for="(f, i) in loads" :key="f.type + i">
            <g v-if="f.type === 'Distributed Force'" class="distrForce">
              <use :xlink:href="getUseTag('Distributed Force A', f)" :x="getX(f.locA)" :y="getGaphY(0, graph)" />
              <use :xlink:href="getUseTag('Distributed Force B', f)" :x="getX(f.locB)" :y="getGaphY(0, graph)" />
              <polygon :points="getPath('distributed polygon graph', f, graph)"></polygon>
            </g>
            <g v-if="f.type === 'Distributed Moment'" class="distrMoment">
              <use :xlink:href="getUseTag('Distributed Moment A', f)" :x="getX(f.locA)" :y="getGaphY(0, graph)" />
              <use :xlink:href="getUseTag('Distributed Moment B', f)" :x="getX(f.locB)" :y="getGaphY(0, graph)" />
              <polygon :points="getPath('distributed polygon graph', f, graph)"></polygon>
            </g>
            <g v-if="f.type === 'Force'" class="force">
              <use :xlink:href="f.valA >= 0 ? '#pos-force' : '#neg-force'" :x="getX(f.locA)" :y="getGaphY(0, graph)" />
            </g>
            <g v-if="f.type === 'Moment'" class="moment">
              <use :xlink:href="f.valA >= 0 ? '#pos-moment' : '#neg-moment'" :x="getX(f.locA)" :y="getGaphY(0, graph)" />
            </g>
          </g>
        </g>
        <!-- Loads -->

        <!-- Supports -->
        <g v-if="showBCs">
          <g v-for="(s, i) in supports" :key="s.type + i">
            <g v-if="s.type === 'Support'" class="support">
              <use xlink:href="#support" :x="getX(s.locA)" :y="getGaphY(0, graph)" />
            </g>
            <g v-if="s.type === 'Slide'" class="slide">
              <use xlink:href="#slide" :x="getX(s.locA)" :y="getGaphY(0, graph)" /> 
            </g>
            <g v-if="s.type === 'Fixed'" class="fix">
              <use :xlink:href="s.locA < beamL / 2 ? '#fix-left' : '#fix-right'" :x="getX(s.locA)" :y="getGaphY(0, graph)" />
            </g>
            <g v-if="s.type === 'Linear Spring'" class="linSpring">
              <use xlink:href="#linSpring" :x="getX(s.locA)" :y="getGaphY(0, graph)" /> 
            </g>
            <g v-if="s.type === 'Torsion Spring'" class="torSpring">
              <use xlink:href="#torSpring" :x="getX(s.locA)" :y="getGaphY(0, graph)" /> 
            </g>
          </g>
        </g>
        <!-- Supports -->
      </svg>
      <SVGToolTip :show='toolTipShow' :inner='toolTipInner' :locTop='toolTipTop' :locLeft='toolTipLeft'/>
    </v-col>
  </v-row>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  import {
    formatNumer
  } from '../general/helpers.js'
  import SVGToolTip from './SVGToolTip'
  import SVGDefs from './SVGDefs'

  const findClosest = (elm, selector) => {
    if (Object.prototype.hasOwnProperty.call(elm, 'closest')){
      return elm.closest(selector)
    } else {
      if (!elm) return null;
      if (elm.tagName == selector) return elm;
      if (!elm.parentElement) {
        return null
      } else{
        return findClosest(elm.parentElement, selector)
      } 
    }
}

  export default {
    props: {
      graphID: String
    },

    data: () => ({
      toolTipShow: false,
      toolTipInner: '',
      toolTipTop: 0,
      toolTipLeft: 0,
    }),

    components: {
      SVGToolTip,
      SVGDefs
    },

    computed: {
      graph: function () {
        switch (this.graphID) {
          case 'qCanvas':
            return this.graphQ;
          case 'mCanvas':
            return this.graphM;
          case 'vCanvas':
            return this.graphV;
          default:
            return null;
        }
      },
      getYLabel: function() {
        switch (this.graphID) {
          case 'qCanvas':
            return 'Shear force, (lb)';
          case 'mCanvas':
            return 'Moment, (lb-in)';
          case 'vCanvas':
            return 'Deflection, (in)';
          default:
            return null;
        }
      },
      ...mapMutations(['updateQMVGraphs']),
      ...mapGetters(['getX', 'getY', 'getGaphY', 'getTransform', 'getPath', 'getUseTag', 'getGraphPath', 'getGH', 'getGS', 'getTL', 'getMX']),
      ...mapState({
        supports: state => state.analysis.supports,
        loads: state => state.analysis.loads,
        graphQ: state => state.analysis.solution.graphQ,
        graphM: state => state.analysis.solution.graphM,
        graphV: state => state.analysis.solution.graphV,
        beamL: state => state.analysis.totalLength,
        screenUpdate: state => state.screenUpdate,
        showAxis: state => state.analysis.solution.showAxis,
        showLoads: state => state.analysis.solution.showLoads,
        showBCs: state => state.analysis.solution.showBCs,
        showMaxMin: state => state.analysis.solution.showMaxMin,
      }),
    },

    methods: {
      onHover(e) {
        const
          caller = findClosest(e.target,"svg");

        if(!caller) return null;

        const 
          rect = caller.getBoundingClientRect(),
          graph = caller.id === 'qCanvas' ? this.graphQ : caller.id === 'mCanvas' ? this.graphM : this.graphV,
          x = e.offsetX,
          y = e.offsetY;
        let abs, minX, minY, gX, gY, minAbs = null;

        for (let i = 0; i<graph.x.length; i++) {
          gX = this.getX(graph.x[i]);
          gY = this.getGaphY(graph.y[i], graph);
          abs = Math.sqrt((gX - x) ** 2 + (gY - y) ** 2);
          if ((minAbs === null) || (abs < minAbs)) {
            minAbs = abs;
            minX = graph.x[i];
            minY = graph.y[i];
          }
        }

        if (caller.id === 'qCanvas')
          this.toolTipInner =
          '<span>Q = ' + formatNumer(minY) + ' lb</span>' +
          '<span>x = ' + formatNumer(minX) + ' in</span>';
        else if (caller.id === 'mCanvas')
          this.toolTipInner =
          '<span>M = ' + formatNumer(minY) + ' lb-in</span>' +
          '<span>x = ' + formatNumer(minX) + ' in</span>';
        else
          this.toolTipInner =
          '<span>V = ' + formatNumer(minY) + ' in</span>' +
          '<span>x = ' + formatNumer(minX) + ' in</span>';
        this.toolTipShow = true;
        this.toolTipTop = rect.top + this.getGaphY(minY, graph);
        this.toolTipLeft = rect.left + this.getX(minX);
      },
      onHoverCancel() {
        this.toolTipShow = false;
      },
      formatNum(inp) {
        return formatNumer(inp);
      },
    }
  }

</script>