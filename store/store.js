import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const
  MARGIN_X = 50,
  MARGIN_Y = 10;

const
  MIN_BEAM_HEIGHT = 0.01,
  MAX_BEAM_HEIGHT = 0.03,
  MIN_FORCE_HEIGHT = 0.05,
  MAX_FORCE_HEIGHT = 0.30,
  MIN_MOMENT_HEIGHT = 0.02,
  MAX_MOMENT_HEIGHT = 0.08;

const defaultLoadBC = {
  type: '',
  locA: 0,
  locB: 0,
  valA: 0,
  valB: 0,
  path: ''
};

const defaultBeam = {
  length: 1.0,
  areaA: 1.0,
  areaB: 1.0,
  inerA: 1.0,
  inerB: 1.0,
  path: '',
  polygonFill: '',
  polygonWhite: '',
};

const defaultText = {
  x: 0,
  y: 0,
};

const defaultState = {
  screen: {
    maxX: 0,
    maxY: 0,
    scaleX: 0,
    beamY: 0,
  },
  beams: {
    maxHeight: 1,
    minHeight: 1.0,
    sections: [{
      length: 10,
      areaA: 1.0,
      areaB: 1.0,
      inerA: 1.0,
      inerB: 1.0,
      path: '',
      polygonFill: '',
      polygonWhite: '',
    }, {
      length: 20,
      areaA: 1.0,
      areaB: 1.0,
      inerA: 1.0,
      inerB: 1.0,
      path: '',
      polygonFill: '',
      polygonWhite: '',
    }],
  },
  loadBCs: {
    maxForce: 100,
    minForce: 20,
    maxMoment: 50,
    minMoment: 50,
    items: [{
      type: 'distributed force',
      locA: 2,
      locB: 4,
      valA: 20,
      valB: 100,
      path: '',
      textA: Object.assign('', defaultText),
      textB: Object.assign('', defaultText),
    }, {
      type: 'force',
      locA: 5,
      valA: -100,
      path: '',
      textA: Object.assign('', defaultText),
    }, {
      type: 'moment',
      locA: 10,
      valA: -50,
      path: '',
      textA: Object.assign('', defaultText),
    }, {
      type: 'support',
      locA: 10,
      x: 0,
      y: 0,
    }]
  },
  dialog: {
    show: false,
    itemIndex: -1,
    type: '',    
    item: null,
    items: null,
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
    getLoadBC: (state) => (id) => {
      return Object.assign({}, state.loadBCs.items[id] || defaultLoadBC);
    },
    getBeam: (state) => (id) => {
      return Object.assign({}, state.beams.sections[id] || defaultBeam);
    },
  },

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

    /*BEAM*/
      addBeam: state => {
        Object.assign(state.dialog, {
          itemIndex: -1,
          show: true,
          type: 'Beam',    
          item: Object.assign({}, defaultBeam),
          items: state.beams.sections,
        });
      },
      editBeam(state, item) {
        Object.assign(state.dialog, {
          itemIndex: state.beams.sections.indexOf(item),
          show: true,
          type: 'Beam',    
          item: Object.assign({}, item),
          items: state.beams.sections,
        });
      },
    /*BEAM*/

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
          return screen.maxY * 0.5 + screen.maxY * Math.sign(y) * (MAX_BEAM_HEIGHT - yScale * (Math.abs(y) - beams.maxHeight));
        },
        getPoint = (x, y) => {
          return getX(x) + ',' + getY(y);
        }

      let x0 = 0,
        x1 = 0,
        totalLength = 0,
        heightA, heightB;

      sections.forEach(section => {
        totalLength += parseFloat(section.length);
      });

      //set screen constants
      screen.scaleX = screen.maxX / totalLength;
      screen.beamY = getY(beams.maxHeight) - screen.maxY * 0.5 + 2;

      sections.forEach(section => {
        heightA = 0.5 * (section.areaA + Math.pow(section.inerA, 1 / 3));
        heightB = 0.5 * (section.areaB + Math.pow(section.inerB, 1 / 3));
        x0 = x1;
        x1 += parseFloat(section.length);
        section.polygonWhite = getPoint(x0, -beams.maxHeight) + ' ' + getPoint(x1, -beams.maxHeight) + ' ' + getPoint(x1, beams.maxHeight) + ' ' + getPoint(x0, beams.maxHeight);
        section.polygonFill = getPoint(x0, -heightA) + ' ' + getPoint(x1, -heightB) + ' ' + getPoint(x1, heightB) + ' ' + getPoint(x0, heightA);
        section.path = 'M' + getPoint(x0, -beams.maxHeight) + 'L' + getPoint(x1, -beams.maxHeight) + 'M' + getPoint(x0, beams.maxHeight) + 'L' + getPoint(x1, beams.maxHeight);
      });
    },

    updateLoadBCsSVG: state => {
      let points;

      state.loadBCs.items.forEach(f => {
        if (f.type === 'distributed force') {
          points = get4Points(state, f, state.loadBCs.minForce, state.loadBCs.maxForce, MIN_FORCE_HEIGHT, MAX_FORCE_HEIGHT);
          f.path = points[0][0] + ',' + points[0][1] + ' ' +
            points[1][0] + ',' + points[1][1] + ' ' +
            points[2][0] + ',' + points[2][1] + ' ' +
            points[3][0] + ',' + points[3][1];
          f.textA.x = points[1][0];
          f.textA.y = points[1][1] + (f.valA > 0 ? 15 : -5);
          f.textB.x = points[2][0];
          f.textB.y = points[2][1] + (f.valB > 0 ? 15 : -5);
        } else if (f.type === 'force') {
          points = get2Points(state, f, state.loadBCs.minForce, state.loadBCs.maxForce, MIN_FORCE_HEIGHT, MAX_FORCE_HEIGHT);
          f.path = points[0][0] + ',' + points[0][1] + ' ' +
            points[1][0] + ',' + points[1][1];
          f.textA.x = points[1][0];
          f.textA.y = points[1][1] + (f.valA > 0 ? 15 : -5);
        } else if (f.type === 'moment') {
          points = get2Points(state, f, state.loadBCs.minMoment, state.loadBCs.maxMoment, MIN_MOMENT_HEIGHT, MAX_MOMENT_HEIGHT, true);
          f.path = 'M ' + (points[0] + points[2]) + ' ' + points[1] + ' A ' +
            points[2] + ' ' + points[2] + ' 0 1 1 ' +
            points[0] + ' ' + (points[1] - points[2]);
          f.textA.x = points[0];
          f.textA.y = points[1] - points[2] + (f.valA > 0 ? 15 : -5);
        } else if (f.type === 'support') {
          points = getBCPoint(state, f);
          f.x = points[0][0];
          f.y = points[0][1];
        }
      });
    }
  },
});

const get4Points = (state, f, minH, maxH, minScreenH, maxScreenH) => {
  const
    ySlope = (maxScreenH - minScreenH) / (minH - maxH),
    yScale = Number.isFinite(ySlope) ? ySlope : 0.0;

  const
    getX = (x) => {
      return MARGIN_X + x * state.screen.scaleX;
    },
    getY = (y, isZero = false) => {
      const val = isZero ? 0 : state.screen.maxY * (maxScreenH - yScale * (Math.abs(y) - maxH));
      return state.screen.maxY * 0.5 + Math.sign(y) * (state.screen.beamY + val);
    };

  return [
    [getX(f.locA), getY(f.valA, true)],
    [getX(f.locA), getY(f.valA)],
    [getX(f.locB), getY(f.valB)],
    [getX(f.locB), getY(f.valB, true)],
  ];
}

const get2Points = (state, f, minH, maxH, minScreenH, maxScreenH, isMoment = false) => {
  const
    ySlope = (maxScreenH - minScreenH) / (minH - maxH),
    yScale = Number.isFinite(ySlope) ? ySlope : 0.0;

  const
    getX = (x) => {
      return MARGIN_X + x * state.screen.scaleX;
    },
    getY = (y, isZero = false) => {
      const val = isZero ? 0 : state.screen.maxY * (maxScreenH - yScale * (Math.abs(y) - maxH));
      return state.screen.maxY * 0.5 + Math.sign(y) * (state.screen.beamY + val);
    };
  
  if (isMoment) {
    const y = getY(f.valA),
      r = Math.abs(y - state.screen.maxY * 0.5);
    
    return [getX(f.locA), y+r, r];
  } else {
    return [
      [getX(f.locA), getY(f.valA, true)],
      [getX(f.locA), getY(f.valA)],
    ];
    
  }
}

const getBCPoint = (state, f) => {
  const
    getX = (x) => {
      return MARGIN_X + x * state.screen.scaleX;
    },
    getY = (type) => {
      if (type === 'support')
        return state.screen.maxY * 0.5 + state.screen.beamY;
      else
        return state.screen.maxY * 0.5;
    };

  return [
    [getX(f.locA), getY(f.type)],
  ];
}