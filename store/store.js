import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const
  MARGIN_X = 10,
  MARGIN_Y = 10;

const
  MIN_BEAM_HEIGHT = 0.02,
  MAX_BEAM_HEIGHT = 0.05,
  MIN_FORCE_HEIGHT = 0.03,
  MAX_FORCE_HEIGHT = 0.30;


const defaultState = {
  screen: {
    maxX: 0,
    maxY: 0,
    scaleX: 0,
    beamY: 0,
  },
  beams: {
    totalLength: 30,
    maxHeight: 1,
    minHeight: 1,
    sections: [{
      length: 10,
      areaA: 1.0,
      areaB: 1,
      inerA: 1.0,
      inerB: 1.0,
      path: '',
      polygonFill: '',
      polygonWhite: '',
    }, {
      length: 20,
      areaA: 1,
      areaB: 1,
      inerA: 1.0,
      inerB: 1.0,
      path: '',
      polygonFill: '',
      polygonWhite: '',
    }],
  },
  forces: {
    maxForce: 100,
    minForce: 10,
    distributed: [{
      locA: 2,
      locB: 4,
      valA: 100,
      valB: 50,
      path: ''
    }, {
      locA: 2,
      locB: 4,
      valA: -90,
      valB: -60,
      path: ''
    }]
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

  getters: {},

  mutations: {
    resetState(state) {
      Object.assign(state, defaultState);
    },
    updateCurrent(state, payload) {
      Object.assign(state, payload);
    },
    showMessage(state, payload) {
      Object.assign(state.snackbar, payload);
    },
    updateBeamsSVG: state => {
      const
        beams = state.beams,
        sections = beams.sections,
        screen = state.screen,
        ySlope = (MAX_BEAM_HEIGHT - MIN_BEAM_HEIGHT) / (beams.minHeight - beams.maxHeight),
        yScale = Number.isFinite(ySlope) ? ySlope : 0.0;

      const
        getX = (x) => {
          return MARGIN_X + x * screen.scaleX;
        },
        getY = (y) => {
          return MARGIN_Y + screen.maxY * 0.5 * (1 + Math.sign(y) * (MAX_BEAM_HEIGHT - yScale * (Math.abs(y) - beams.maxHeight)));
        },
        getPoint = (x, y) => {
          return getX(x) + ',' + getY(y);
        }
      
      let x0 = 0,
        x1 = 0,
        length, heightA, heightB;
      
      //set screen constants
      screen.scaleX = screen.maxX / beams.totalLength;
      screen.beamY = getY(beams.maxHeight) + 2;

      sections.forEach(section => {
        length = section.length;
        heightA = 0.5 * (section.areaA + Math.pow(section.inerA, 1 / 3));
        heightB = 0.5 * (section.areaB + Math.pow(section.inerB, 1 / 3));
        x0 = x1;
        x1 += length;
        section.polygonWhite = getPoint(x0, -beams.maxHeight) + ' ' + getPoint(x1, -beams.maxHeight) + ' ' + getPoint(x1, beams.maxHeight) + ' ' + getPoint(x0, beams.maxHeight);
        section.polygonFill = getPoint(x0, -heightA) + ' ' + getPoint(x1, -heightB) + ' ' + getPoint(x1, heightB) + ' ' + getPoint(x0, heightA);
        section.path = 'M' + getPoint(x0, -beams.maxHeight) + 'L' + getPoint(x1, -beams.maxHeight) + 'M' + getPoint(x0, beams.maxHeight) + 'L' + getPoint(x1, beams.maxHeight);
      });
    },
    updateForcesSVG: state => {
      const
        forces = state.forces,
        screen = state.screen,
        distributed = forces.distributed,
        ySlope = (MAX_FORCE_HEIGHT - MIN_FORCE_HEIGHT) / (forces.minForce - forces.maxForce),
        yScale = Number.isFinite(ySlope) ? ySlope : 0.0;

      const
        getX = (x) => {
          return MARGIN_X + x * screen.scaleX;
        },
        getY = (y) => {
          return MARGIN_Y + screen.maxY * 0.5 * (1 + Math.sign(y) * (MAX_FORCE_HEIGHT - yScale * (Math.abs(y) - forces.maxForce)));
        },
        getPoint = (x, y) => {
          return getX(x) + ',' + getY(y);
        };

      distributed.forEach(f => {
        f.path = 'M' + getX(f.locA) + ',' + Math.sign(f.valA) * screen.beamY + 'L' + getPoint(f.locA, f.valA) + 'L' + getPoint(f.locB, f.valB) + 'L' + getX(f.locB) + ',' + Math.sign(f.valB) * screen.beamY;
      });
    }
  },
});