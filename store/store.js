import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const defaultState = {
    screen:{
      MIN_X: 10,
      MAX_X: 0,
      MIN_Y: 10,
      MAX_Y: 30,
    },
    beams:{ 
      totalLength: 30,
      maxHeight: 1,
      minHeight: Math.sqrt(0.5),
      sections: [ {
          length: 10,
          areaA: 1.0,
          areaB: 0.5,
          inerA: 1.0,
          inerB: 1.0,
        }, {
          length: 20,
          areaA: 0.8,
          areaB: 0.7,
          inerA: 1.0,
          inerB: 1.0,
        }],
    },
    appVersion: 'v0.0.1',
    snackbar: {
      message: '',
      color: '',
      timeout: 5000,
      show: false
    }
  };


export default new Vuex.Store({
  state: Object.assign({}, defaultState),
  
  getters: {
    getBeamRect: state => (id) => {
      const len = state.beams[id].length,
            heightA = Math.sqrt(state.beams[id].areaA * Math.pow(state.beams[id].inerA, 1/3)),
            heightB = Math.sqrt(state.beams[id].areaB * Math.pow(state.beams[id].inerB, 1/3)),
            xScale = (state.BEAM_MAX_X-2*BEAM_MIN_X)/state.totalLength,
            yScale = Number.isFinite((BEAM_MAX_Y-BEAM_MIN_Y)/(state.minAreaIner-state.maxAreaIner)) ? (BEAM_MAX_Y-BEAM_MIN_Y)/(state.minAreaIner-state.maxAreaIner) : 0.0,
            getH = (h) => {return BEAM_MAX_Y - yScale * (h-state.maxAreaIner)};
      let x0=0;
      for(let i=0; i < id; i++) x0+=state.beams[i].length;
      return 'M' + (BEAM_MIN_X+x0*xScale) + ' 0 h'+ len*xScale + 'v' + getH(hB) + 'L' + (BEAM_MIN_X+x0*xScale) + ' ' + getH(hA) +'Z'
    }
  },
  
  mutations: {
    resetState(state){
      Object.assign(state, defaultState);
    },
    updateCurrent(state, payload) {
      Object.assign(state, payload);
    },
    showMessage (state, payload) {
      Object.assign(state.snackbar, payload);
    }
  },
});