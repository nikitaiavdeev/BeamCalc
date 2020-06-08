<template>
  <v-card outlined>
    <v-card-title dense>QMV Diagrams</v-card-title>
    <v-card-text>

      <v-row dense>
        <v-col>
          <svg id="qCanvas" width="100%" :height="canvasHeight + 'px'" @mousemove="onHover" @mouseleave ="onHoverCancel">
            <defs>
              <marker id="arrow-axis" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
            </defs>

            <g :transform="graphQ.transform">
              <path :d="getPath(graphQ)" vector-effect="non-scaling-stroke"/>
            </g>

            <g class = "axises">
              <line class = "axis"
                :x1="graphQ.getX(0)" :y1="graphQ.getY(graphQ.min)" :x2="graphQ.getX(0)" :y2="graphQ.getY(graphQ.max)"/>
              <text class = "yAxisTitle" dominant-baseline = "middle"
                :x="graphQ.getX(0) + 2 * tickL" :y="graphQ.getY(graphQ.max)">
                  Shear force, (lb)
              </text>
              <line class = "axis"
                :x1="graphQ.getX(0)" :y1="graphQ.getY(0)" :x2="graphQ.getX(beamL) + marginX/2" :y2="graphQ.getY(0)"/>
              <text class = "xAxisTitle" dominant-baseline = "baseline"
                :x="graphQ.getX(beamL) + marginX/2" :y="graphQ.getY(0) - 2 * tickL">
                  x, (in)
              </text>

              <g v-for="i in graphSteps + 1" :key="i">
                <line
                  :x1="graphQ.getX(0) - tickL" :y1="graphQ.getY(graphQ.min + graphQ.step * (i - 0.5))" 
                  :x2="graphQ.getX(0)" :y2="graphQ.getY(graphQ.min + graphQ.step * (i - 0.5))" />
                <text class = "yAxisText" dominant-baseline = "middle"
                  :x="graphQ.getX(0) - 2 * tickL " :y="graphQ.getY(graphQ.min + graphQ.step * (i - 0.5))">
                    {{formatNum( graphQ.min + graphQ.step * (i - 0.5) )}}
                </text>

                <line
                  :x1="graphQ.getX(beamL * i / graphSteps)" :y1="graphQ.getY(0)" 
                  :x2="graphQ.getX(beamL * i / graphSteps)" :y2="graphQ.getY(0) + tickL" />
                <text class = "xAxisText" dominant-baseline = "hanging"
                  :x="graphQ.getX(beamL * i / graphSteps) " :y="graphQ.getY(0) + tickL">
                    {{formatNum( beamL * i / graphSteps )}}
                </text>
              </g>
            </g>
          </svg>
        </v-col>
      </v-row>
      
      <v-row dense>
        <v-col>
          <svg id="mCanvas" width="100%" :height="canvasHeight + 'px'" @mousemove="onHover" @mouseleave ="onHoverCancel">
            <defs>
              <marker id="arrow-axis" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
            </defs>

            <g :transform="graphM.transform">
              <path :d="getPath(graphM)" vector-effect="non-scaling-stroke"/>
            </g>

            <g class = "axises">
              <line class = "axis"
                :x1="graphM.getX(0)" :y1="graphM.getY(graphM.min)" :x2="graphM.getX(0)" :y2="graphM.getY(graphM.max)"/>
              <text class = "yAxisTitle" dominant-baseline = "middle"
                :x="graphM.getX(0) + 2 * tickL" :y="graphM.getY(graphM.max)">
                  Moment, (lb-in)
              </text>
              <line class = "axis"
                :x1="graphM.getX(0)" :y1="graphM.getY(0)" :x2="graphM.getX(beamL) + marginX/2" :y2="graphM.getY(0)"/>
              <text class = "xAxisTitle" dominant-baseline = "baseline"
                :x="graphM.getX(beamL) + marginX/2" :y="graphM.getY(0) - 2 * tickL">
                  x, (in)
              </text>

              <g v-for="i in graphSteps + 1" :key="i">
                <line
                  :x1="graphM.getX(0) - tickL" :y1="graphM.getY(graphM.min + graphM.step * (i - 0.5))" 
                  :x2="graphM.getX(0)" :y2="graphM.getY(graphM.min + graphM.step * (i - 0.5))" />
                <text class = "yAxisText" dominant-baseline = "middle"
                  :x="graphM.getX(0) - 2 * tickL" :y="graphM.getY(graphM.min + graphM.step * (i - 0.5))">
                    {{formatNum( graphM.min + graphM.step * (i - 0.5) )}}
                </text>

                <line
                  :x1="graphM.getX(beamL * i / graphSteps)" :y1="graphM.getY(0)" 
                  :x2="graphM.getX(beamL * i / graphSteps)" :y2="graphM.getY(0) + tickL" />
                <text class = "xAxisText" dominant-baseline = "hanging"
                  :x="graphM.getX(beamL * i / graphSteps) " :y="graphM.getY(0) + 2 * tickL">
                    {{formatNum( beamL * i / graphSteps )}}
                </text>
              </g>
            </g>
          </svg>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <svg id="vCanvas" width="100%" :height="canvasHeight + 'px'" @mousemove="onHover" @mouseleave ="onHoverCancel">
            <defs>
              <marker id="arrow-axis" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10z" stroke="none"/>
              </marker>
            </defs>

            <g :transform="graphV.transform">
              <path :d="getPath(graphV)" vector-effect="non-scaling-stroke"/>
            </g>

            <g class = "axises">
              <line class = "axis"
                :x1="graphV.getX(0)" :y1="graphV.getY(graphV.min)" :x2="graphV.getX(0)" :y2="graphV.getY(graphV.max)"/>
              <text class = "yAxisTitle" dominant-baseline = "middle"
                :x="graphV.getX(0) + 2 * tickL" :y="graphV.getY(graphV.max)">
                  Deflection × 10³, (in)
              </text>
              <line class = "axis"
                :x1="graphV.getX(0)" :y1="graphV.getY(0)" :x2="graphV.getX(beamL) + marginX/2" :y2="graphV.getY(0)"/>
              <text class = "xAxisTitle" dominant-baseline = "baseline"
                :x="graphV.getX(beamL) + marginX/2" :y="graphV.getY(0) - 2 * tickL">
                  x, (in)
              </text>

              <g v-for="i in graphSteps + 1" :key="i">
                <line
                  :x1="graphV.getX(0) - tickL" :y1="graphV.getY(graphV.min + graphV.step * (i - 0.5))" 
                  :x2="graphV.getX(0)" :y2="graphV.getY(graphV.min + graphV.step * (i - 0.5))" />
                <text class = "yAxisText" dominant-baseline = "middle"
                  :x="graphV.getX(0) - 2 * tickL" :y="graphV.getY(graphV.min + graphV.step * (i - 0.5))">
                    {{formatNum( graphV.min + graphV.step * (i - 0.5) )}}
                </text>

                <line
                  :x1="graphV.getX(beamL * i / graphSteps)" :y1="graphV.getY(0)" 
                  :x2="graphV.getX(beamL * i / graphSteps)" :y2="graphV.getY(0) + tickL" />
                <text class = "xAxisText" dominant-baseline = "hanging"
                  :x="graphV.getX(beamL * i / graphSteps) " :y="graphV.getY(0) + 2 * tickL">
                    {{formatNum(beamL * i / graphSteps)}}
                </text>
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
  import { MARGIN_X, MARGIN_Y, GRAPH_STEPS, GRAPH_HEIGHT } from '../store/store.js'
  import { mapState,mapMutations } from 'vuex'
  import { formatNumer } from '../general/helpers.js'
  import SVGToolTip from './SVGToolTip'

  export default {
      components: {
          SVGToolTip
      },

      computed: {
        ...mapMutations(['updateQMVGraphs']),
        ...mapState({
            graphQ: state => state.analysis.solution.graphQ,
            graphM: state => state.analysis.solution.graphM,
            graphV: state => state.analysis.solution.graphV,
            beamL: state => state.analysis.totalLength
        }),
        canvasHeight: () => {
          return GRAPH_HEIGHT;
        },
        graphSteps: () => {
          return GRAPH_STEPS;
        },
        marginY: () => {
          return MARGIN_Y;
        },
        marginX: () => {
          return MARGIN_X;
        }
      },

      data: () => ({
          tickL: 6,
          toolTipShow: false,
          toolTipInner: '',
          toolTipTop: 0,
          toolTipLeft: 0
      }),

      methods: {
        getPath: (graph) => {
          return 'M' + graph.arr.join('L');
        },
        onHover(e) {
          const 
            caller = e.target.closest("svg"),
            rect = caller.getBoundingClientRect(),
            graph = caller.id === 'qCanvas' ? this.graphQ : caller.id === 'mCanvas' ? this.graphM : this.graphV,
            x = e.offsetX,
            y =  e.offsetY;
          
          let abs, minX, minY, gX, gY, minAbs = null;
          
          for(const p of graph.arr){
            gX = graph.getX(p[0]);
            gY = graph.getY(p[1]);
            abs = Math.sqrt((gX - x) ** 2 + (gY - y) ** 2);
            if ((minAbs === null) || (abs < minAbs)){
              minAbs = abs;
              minX = p[0];
              minY = p[1];
            }
          }

          if(caller.id === 'qCanvas')
            this.toolTipInner = 
              '<span>Q = ' + formatNumer(minY) + ' lb</span>'+
              '<span>x = ' + formatNumer(minX) + ' in</span>';
          else if (caller.id === 'mCanvas')
            this.toolTipInner = 
              '<span>M = ' + formatNumer(minY) + ' lb-in</span>'+
              '<span>x = ' + formatNumer(minX) + ' in</span>';
          else
            this.toolTipInner = 
              '<span>V = ' + formatNumer(minY) + ' in</span>'+
              '<span>x = ' + formatNumer(minX) + ' in</span>';
          this.toolTipShow = true;
          this.toolTipTop = rect.top + graph.getY(minY);
          this.toolTipLeft = rect.left + graph.getX(minX);
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