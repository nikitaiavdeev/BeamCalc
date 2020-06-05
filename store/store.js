import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const
  MARGIN_X = 50,
  MARGIN_Y = 5,
  BEAM_HEIGHT = 0.03,
  VECTOR_HEIGHT = 0.35,
  MOMENT_HEIGHT = 0.10,
  GRAPH_STEPS = 6,
  GRAPH_HEIGHT = 200;

const
  defaultLoad = {
    type: 'Force'
  },
  defaultBC = {
    type: 'Fixed',
    locA: ''
  },
  defaultBeam = {
    length: 1,
    modulus: 10.3,
    inertia: 1.0,
  };

const defaultState = {
  screen: {
    maxX: 0,
    maxY: 0,
    scaleX: 0,
  },
  analysis: {
    totalLength: 0.0,
    beams: [{
      length: 10,
      modulus: 10.3,
      inertia: 1.0,
    }],
    supports: [],
    loads: [],
    solved: false,
    solution: {},
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
    timeout: 5000,
    show: false
  },
  appVersion: 'v0.0.3',
};

import {
  drawBeams,
  drawForces,
  updateQMVGraphs
} from './drawHelper.js'
import {
  solve
} from '../general/solve.js'
import {
  objectClone
} from '../general/helpers.js'

export default new Vuex.Store({
  state: objectClone(defaultState), //Object.assign({}, defaultState),

  mutations: {
    resetState(state) {
      Object.assign(state, objectClone(defaultState));
      state.screen.maxX = document.getElementById('canvas').clientWidth - 2 * MARGIN_X;
      state.screen.maxY = document.getElementById('canvas').clientHeight - 2 * MARGIN_Y;
      drawBeams(state);
      drawForces(state);

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
      a.download = 'beam.json';
      a.click();
      URL.revokeObjectURL(a.href);
    },
    openFile(state, file) {
      Object.assign(state, objectClone(defaultState));
      Object.assign(state.analysis, JSON.parse(file));

      state.screen.maxX = document.getElementById('canvas').clientWidth - 2 * MARGIN_X;
      state.screen.maxY = document.getElementById('canvas').clientHeight - 2 * MARGIN_Y;
      drawBeams(state);
      drawForces(state);
      if (state.analysis.solved)
        updateQMVGraphs(state);
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

    /*UPDATE SVG*/
    updateBeamsSVG: state => {
      drawBeams(state);
    },

    updateLoadBCsSVG: state => {
      drawForces(state);
    },

    updateQMVSVG: state => {
      if (state.analysis.solved) updateQMVGraphs(state);
    },
    /*UPDATE SVG*/

    /*Solve Beam*/
    solveBeam: state => {
      solve(state);
    }
  },
});