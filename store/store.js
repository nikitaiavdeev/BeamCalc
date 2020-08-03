import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const
  MARGIN_X = 60,
  MARGIN_Y = 20,
  BEAM_HEIGHT = 5,
  VECTOR_HEIGHT = 80,
  MOMENT_HEIGHT = 0.10,
  GRAPH_STEPS = 6,
  GRAPH_HEIGHT = 250,
  TICK_L = 6;

const
  defaultLoad = {
    type: 'Force'
  },
  defaultBC = {
    type: 'Fixed',
    locA: '0'
  },
  defaultBeam = {
    length: 1,
    modulus: 10.3,
    inertia: 1.0,
  };

const defaultState = {
  screenUpdate: false,
  hideTables: false,
  analysis: {
    title: 'Example',
    totalLength: 10.0,
    beams: [{
      length: 10,
      modulus: 10.3,
      inertia: 1.0,
    }],
    supports: [],
    loads: [],
    solved: false,
    solution: {
      showAxis: true,
      showLoads: true,
      showBCs: true,
      showMaxMin: true,
    },
  },
  dialog: {
    show: false,
    itemIndex: -1,
    type: '',
    item: null,
    items: null,
  },
  snackbar: {
    message: '',
    color: '',
    timeout: 3000,
    show: false
  },
  appVersion: 'v1.0.3',
};

import { solve } from '../general/solve.js'
import { objectClone } from '../general/helpers.js'
import { getField, updateField } from 'vuex-map-fields';

const getXScale = (state) => {
  if (document.getElementById('canvasBeam'))
    return (document.getElementById('canvasBeam').clientWidth - 2 * MARGIN_X) / state.analysis.totalLength;
  else 
    return 0;
}

export default new Vuex.Store({
  state: objectClone(defaultState),

  getters: {
    getField,
    getBeamX : state => index => {
      const x = state.analysis.beams.reduce((x,b,i) => i < index ? x + b.length : x, 0);
      return MARGIN_X + x * getXScale(state);
    },
    getBeamY : () => y => {
      return GRAPH_HEIGHT * (0.5) + Math.sign(y)* BEAM_HEIGHT;
    },
    getX : state => x => {
      return MARGIN_X + x * getXScale(state);
    },
    getY : () => y => {
      return GRAPH_HEIGHT * (0.5) + y;
    },
    getTextY : () => (y, scale, y1 = null) => {
      if (y == 0){
        scale = 0;
        return GRAPH_HEIGHT * 0.5  + Math.sign(y1)* BEAM_HEIGHT + (y1 > 0 ? VECTOR_HEIGHT*scale + 2.5*TICK_L :  - VECTOR_HEIGHT*scale -TICK_L);
      } else {
        if(Math.abs(y1) > Math.abs(y)) scale = 0.5;
        return GRAPH_HEIGHT * 0.5  + Math.sign(y)* BEAM_HEIGHT + (y > 0 ? VECTOR_HEIGHT*scale + 2.5*TICK_L :  - VECTOR_HEIGHT*scale -TICK_L);
      }      
    },
    getGaphY : () => (y, graph) => {
      const scaleY = (GRAPH_HEIGHT - 5 * MARGIN_Y) / (graph.graphMin - graph.graphMax);
      return y * scaleY + (GRAPH_HEIGHT - scaleY * (graph.graphMax + graph.graphMin)) / 2;
    },
    getUseTag : () =>(name, f) => {
      switch (name) {
        case 'Distributed Force A':
          return  f.valA == 0 ? '' : 
                  (f.valA > 0 ? '#pos-dis-force' : '#neg-dis-force') + (Math.abs(f.valA) < Math.abs(f.valB) ? '0.5' : '');
        case 'Distributed Force B':
          return  f.valB == 0 ? '' : 
                  (f.valB > 0 ? '#pos-dis-force' : '#neg-dis-force') + (Math.abs(f.valB) < Math.abs(f.valA) ? '0.5' : '');
        case 'Distributed Moment A':
          return  f.valA == 0 ? '' : 
                  (f.valA > 0 ? '#pos-dis-moment' : '#neg-dis-moment') + (Math.abs(f.valA) < Math.abs(f.valB) ? '0.5' : '');
        case 'Distributed Moment B':
          return  f.valB == 0 ? '' : 
                  (f.valB > 0 ? '#pos-dis-moment' : '#neg-dis-moment') + (Math.abs(f.valB) < Math.abs(f.valA) ? '0.5' : '');
      }
    },
    getPath : (_state, getters) => (name, i = null, g = null) => {
      switch (name) {
        case 'beam polygon':
          return  getters.getBeamX(i) + ',' + getters.getBeamY(-1) + ' ' + 
                  getters.getBeamX(i+1) + ',' + getters.getBeamY(-1) + ' ' + 
                  getters.getBeamX(i+1) + ',' + getters.getBeamY(1) + ' ' + 
                  getters.getBeamX(i) + ',' + getters.getBeamY(1);
        case 'beam path':
          return  'M' + getters.getBeamX(i) + ',' + getters.getBeamY(-1) + 
                  'L' + getters.getBeamX(i+1) + ',' + getters.getBeamY(-1) + 
                  'M' + getters.getBeamX(i) + ',' + getters.getBeamY(1) + 
                  'L' + getters.getBeamX(i+1) + ',' + getters.getBeamY(1);
        case 'distributed polygon':
          return  getters.getX(i.locA) + ',' + getters.getY( 0 ) + ' ' +
                  getters.getX(i.locA) + ',' + getters.getY( Math.sign(i.valA) * (VECTOR_HEIGHT*(Math.abs(i.valA) < Math.abs(i.valB) ? 0.5 : 0.75) + BEAM_HEIGHT) ) + ' ' +
                  getters.getX(i.locB) + ',' + getters.getY( Math.sign(i.valB) * (VECTOR_HEIGHT*(Math.abs(i.valB) < Math.abs(i.valA) ? 0.5 : 0.75) + BEAM_HEIGHT) ) + ' ' +
                  getters.getX(i.locB) + ',' + getters.getY( 0 )
        case 'distributed polygon graph':
          return  getters.getX(i.locA) + ',' + getters.getGaphY( 0, g ) + ' ' +
                  getters.getX(i.locA) + ',' + ( getters.getGaphY( 0, g ) + Math.sign(i.valA) * (VECTOR_HEIGHT*(Math.abs(i.valA) < Math.abs(i.valB) ? 0.5 : 0.75)) ) + ' ' +
                  getters.getX(i.locB) + ',' + ( getters.getGaphY( 0, g ) + Math.sign(i.valB) * (VECTOR_HEIGHT*(Math.abs(i.valB) < Math.abs(i.valA) ? 0.5 : 0.75)) ) + ' ' +
                  getters.getX(i.locB) + ',' + getters.getGaphY( 0, g )
      }
    },
    getGraphPath: (_state, getters) => (graph) => {
      let p = '';
      for(let i = 0; i<graph.x.length; i++){
        p += (i == 0 ? 'M' : 'L') + getters.getX(graph.x[i]) + ',' + getters.getGaphY(graph.y[i],graph );
      }
      return p;
    },
    getGS: () => {
      return GRAPH_STEPS;
    },
    getGH: () => {
      return GRAPH_HEIGHT;
    },
    getBH: () => {
      return BEAM_HEIGHT;
    },
    getVH: () => {
      return VECTOR_HEIGHT;
    },
    getTL: () => {
      return TICK_L;
    },
    getMX: () => {
      return MARGIN_X;
    }
  },

  mutations: {
    updateField,
    onResize(state) {
      state.screenUpdate = !state.screenUpdate;
    },
    resetState(state) {
      Object.assign(state, objectClone(defaultState));
    },
    updateCurrent(state, payload) {
      Object.assign(state, payload);
    },
    showMessage(state, payload) {
      Object.assign(state.snackbar, payload);
    },

    /*FILE*/
    saveFile: state => {
      const a = document.createElement("a");
      const file = new Blob([JSON.stringify(state.analysis, null, 4)], {
        type: 'text/plain;charset=utf-8'
      });
      a.href = URL.createObjectURL(file);
      a.download = 'beam.bclc';
      a.click();
      URL.revokeObjectURL(a.href);
    },
    saveResults: state =>{
      const 
        a = document.createElement("a"),
        graphQ = state.analysis.solution.graphQ,
        graphM = state.analysis.solution.graphM,
        graphV = state.analysis.solution.graphV,
        iMax = Math.max(graphQ.x.length, graphM.x.length, graphV.x.length);
      let data = 'x,Q,x,M,x,V\r\n';
      for ( let i=0; i < iMax; i++ ){
        data += (graphQ.x[i] === undefined ? ',' : graphQ.x[i] + ',' + graphQ.y[i] ) + ',' + 
                (graphM.x[i] === undefined ? ',' : graphM.x[i] + ',' + graphM.y[i] ) + ',' + 
                (graphV.x[i] === undefined ? ',' : graphV.x[i] + ',' + graphV.y[i] ) + '\r\n';
      }
      const file = new Blob([data], {
        type: 'text/plain;charset=utf-8'
      });
      a.href = URL.createObjectURL(file);
      a.download = 'beam_results.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    },
    openFile(state, file) {
      Object.assign(state, objectClone(defaultState));
      Object.assign(state.analysis, JSON.parse(file));
    },
    /*FILE*/

    /*BEAM*/
    addBeam: state => {
      Object.assign(state.dialog, {
        itemIndex: -1,
        show: true,
        type: 'Beam',
        item: Object.assign({}, defaultBeam),
        items: state.analysis.beams,
      });
    },
    editBeam(state, item) {
      Object.assign(state.dialog, {
        itemIndex: state.analysis.beams.indexOf(item),
        show: true,
        type: 'Beam',
        item: Object.assign({}, item),
        items: state.analysis.beams,
      });
    },
    /*BEAM*/

    /*Load*/
    addLoad: state => {
      Object.assign(state.dialog, {
        itemIndex: -1,
        show: true,
        type: 'Load',
        item: Object.assign({}, defaultLoad),
        items: state.analysis.loads,
      });
    },
    editLoad(state, item) {
      Object.assign(state.dialog, {
        itemIndex: state.analysis.loads.indexOf(item),
        show: true,
        type: 'Load',
        item: Object.assign({}, item),
        items: state.analysis.loads,
      });
    },
    /*Load*/

    /*BCs*/
    addBC: state => {
      Object.assign(state.dialog, {
        itemIndex: -1,
        show: true,
        type: 'Support',
        item: Object.assign({}, defaultBC),
        items: state.analysis.supports,
      });
    },
    editBC(state, item) {
      Object.assign(state.dialog, {
        itemIndex: state.analysis.supports.indexOf(item),
        show: true,
        type: 'Support',
        item: Object.assign({}, item),
        items: state.analysis.supports,
      });
    },
    /*BCs*/

    /*Solve Beam*/
    solveBeam: state => {
      solve(state);
    }
  },
});