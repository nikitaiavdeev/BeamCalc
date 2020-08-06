<template>
  <defs>
    <marker id="arrow-axisY" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="10" markerHeight="10">
      <path d="M0,10L5,0L10,10z" stroke="none" />
    </marker>
    <marker id="arrow-axisX" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="10" markerHeight="10">
      <path d="M0,0L10,5L0,10z" stroke="none" />
    </marker>
    <g id="pos-force">
      <path d="M-5,10L0,0L5,10z" stroke="none" />
      <path :d="'M0,10v' + ( getVH - 10 )" stroke-width="2" />
    </g>
    <g id="neg-force">
      <path d="M-5,-10L0,0L5,-10z" stroke="none" />
      <path :d="'M0,-10v' + ( -getVH + 10 )" stroke-width="2" />
    </g>

    <g id="pos-dis-force">
      <path d="M-5,10L0,0L5,10z" stroke="none" />
      <path :d="'M0,10v' + ( getVH*0.75 - 10 )" stroke-width="2" />
    </g>
    <g id="neg-dis-force">
      <path d="M-5,-10L0,0L5,-10z" stroke="none" />
      <path :d="'M0,-10v' + ( -getVH*0.75 + 10 )" stroke-width="2" />
    </g>
    <g id="pos-dis-force0.5">
      <path d="M-5,10L0,0L5,10z" stroke="none" />
      <path :d="'M0,10v' + ( getVH*0.5 - 10 )" stroke-width="2" />
    </g>
    <g id="neg-dis-force0.5">
      <path d="M-5,-10L0,0L5,-10z" stroke="none" />
      <path :d="'M0,-10v' + ( -getVH*0.5 + 10 )" stroke-width="2" />
    </g>

    <g id="pos-dis-moment">
      <path d="M-5,10L0,0L5,10z" stroke="none" />
      <path d="M-5,20L0,10L5,20z" stroke="none" />
      <path :d="'M0,10v' + ( getVH*0.75 - 10 )" stroke-width="2" />
    </g>
    <g id="neg-dis-moment">
      <path d="M-5,-10L0,0L5,-10z" stroke="none" />
      <path d="M-5,-20L0,-10L5,-20z" stroke="none" />
      <path :d="'M0,-10v' + ( -getVH*0.75 + 10 )" stroke-width="2" />
    </g>
    <g id="pos-dis-moment0.5">
      <path d="M-5,10L0,0L5,10z" stroke="none" />
      <path d="M-5,20L0,10L5,20z" stroke="none" />
      <path :d="'M0,10v' + ( getVH*0.5 - 10 )" stroke-width="2" />
    </g>
    <g id="neg-dis-moment0.5">
      <path d="M-5,-10L0,0L5,-10z" stroke="none" />
      <path d="M-5,-20L0,-10L5,-20z" stroke="none" />
      <path :d="'M0,-10v' + ( -getVH*0.5 + 10 )" stroke-width="2" />
    </g>

    <g id="pos-moment">
      <path d="M-5,0L0,-10L5,0z" stroke="none"
        :transform="'translate(' + (getVH / 2 * 0.7071) + ' ' + (getVH / 2 * 0.7071) + ') rotate(45)'" />
      <path :d="  'M ' + (getVH / 2 * 0.7071) + ' ' + (getVH / 2 * 0.7071) +
                        'A' +  (getVH / 2) + ' ' + (getVH / 2) + ' 0 0 1 ' + 
                         (-getVH / 2 * 0.7071) + ' ' + (getVH / 2 * 0.7071)" stroke-width="2" fill="none" />
    </g>
    <g id="neg-moment">
      <path d="M-5,0L0,-10L5,0z" stroke="none"
        :transform="'translate(' + (getVH / 2 * 0.7071) + ' ' + (-getVH / 2 * 0.7071) + ') rotate(-225)'" />
      <path :d="  'M ' + (-getVH / 2 * 0.7071) + ' ' + (-getVH / 2 * 0.7071) +
                        'A' +  (getVH / 2) + ' ' + (getVH / 2) + ' 0 0 1 ' + 
                         (getVH / 2 * 0.7071) + ' ' + (-getVH / 2 * 0.7071)" stroke-width="2" fill="none" />
    </g>

    <g id="support">
      <path d="M 0,0 10,18 H -10 Z" stroke-width="0" />
      <path d="M -12,18 H 12" stroke-width="2" />
      <path d="M -8,19 H -6 L-10,24 H -12 Z" stroke-width="0" />
      <path d="M -2,19 H 0 L -4,24 H -6 Z" stroke-width="0" />
      <path d="M 4,19 H 6 L 2,24 H 0 Z" stroke-width="0" />
      <path d="M 10,19 H 12 L 8,24 H 6 Z" stroke-width="0" />
    </g>
    <g id="slide">
      <path d="M -6,-20 V 20" stroke-width="3" />
      <path d="M 6,-20 V 20" stroke-width="3" />
      <circle cx="0" cy="-10" r="5" stroke-width="0" />
      <circle cx="0" cy="10" r="5" stroke-width="0" />
    </g>
    <g id="fix-left">
      <path d="M 0,-20 V 20" stroke-width="4" />
      <path d="M -2,-20 v 2 L-10,-10 v -2 Z" stroke-width="0" />
      <path d="M -2,-10 v 2 L-10,0 v -2 Z" stroke-width="0" />
      <path d="M -2,0 v 2 L-10,10 v -2 Z" stroke-width="0" />
      <path d="M -2,10 v 2 L-10,20 v -2 Z" stroke-width="0" />
    </g>
    <g id="fix-right">
      <path d="M 0,-20 V 20" stroke-width="4" />
      <path d="M 2,-20 v 2 L10,-10 v -2 Z" stroke-width="0" />
      <path d="M 2,-10 v 2 L10,0 v -2 Z" stroke-width="0" />
      <path d="M 2,0 v 2 L10,10 v -2 Z" stroke-width="0" />
      <path d="M 2,10 v 2 L10,20 v -2 Z" stroke-width="0" />
    </g>
    <g id="linSpring">
      <polyline points="0,0 0,5 -12,10 12,15 0,20 0,25" style="fill:none;stroke-width:2;stroke-linejoin:bevel" />
      <path d="M -12,25 H 12" stroke-width="2" />
      <path d="M -8,26 H -6 L-10,31 H -12 Z" stroke-width="0" />
      <path d="M -2,26 H 0 L -4,31 H -6 Z" stroke-width="0" />
      <path d="M 4,26 H 6 L 2,31 H 0 Z" stroke-width="0" />
      <path d="M 10,26 H 12 L 8,31 H 6 Z" stroke-width="0" />
    </g>
    <g id="torSpring">
      <path
        d="M0,0C-0.25,3.34 -3.92,1.92 -4.6,-0.34 -5.59,-3.65 -2.6,-6.61 0.52,-6.97 4.98,-7.49 8.66,-3.64 8.89,0.66 9.18,6.08 4.5,10.45 -0.78,10.57 -7.06,10.7 -12.06,5.25 -12.08,-0.89 -12.1,-7.96 -5.94,-13.55 1,-13.48 8.79,-13.4 14.93,-6.58 14.78,1.1 14.62,9.57 7.19,16 0,16"
        style="fill:none;stroke-width:2" />
      <path d="M -12,16 H 12" stroke-width="2" />
      <path d="M -8,17 H -6 L-10,22 H -12 Z" stroke-width="0" />
      <path d="M -2,17 H 0 L -4,22 H -6 Z" stroke-width="0" />
      <path d="M 4,17 H 6 L 2,22 H 0 Z" stroke-width="0" />
      <path d="M 10,17 H 12 L 8,22 H 6 Z" stroke-width="0" />
    </g>
  </defs>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['getVH']),
    }
  }
</script>