import {
  MARGIN_X,
  MARGIN_Y,
  BEAM_HEIGHT,
  VECTOR_HEIGHT,
  MOMENT_HEIGHT,
  GRAPH_STEPS,
  GRAPH_HEIGHT
} from '../store/store.js'

const drawBeams = (state) => {
  const
    sections = state.beams.sections,
    screen = state.screen;

  const
    getPoint = (x, y) => {
      return (MARGIN_X + x * screen.scaleX) + ',' + screen.maxY * (0.5 + y);
    }

  let x0 = 0,
    x1 = 0;

  state.beams.totalLength = 0;

  sections.forEach(section => {
    state.beams.totalLength += section.length;
  });

  //set screen constants
  screen.scaleX = screen.maxX / state.beams.totalLength;

  sections.forEach(section => {
    x0 = x1;
    x1 += section.length;
    Object.assign(section, {
      polygonFill: getPoint(x0, -BEAM_HEIGHT) + ' ' + getPoint(x1, -BEAM_HEIGHT) + ' ' + getPoint(x1, BEAM_HEIGHT) + ' ' + getPoint(x0, BEAM_HEIGHT),
      path: 'M' + getPoint(x0, -BEAM_HEIGHT) + 'L' + getPoint(x1, -BEAM_HEIGHT) + 'M' + getPoint(x0, BEAM_HEIGHT) + 'L' + getPoint(x1, BEAM_HEIGHT)
    });
  });
}

const drawForces = (state) => {
  let points;
  const 
    supports = state.supports,
    loads = state.loads;

  supports.forEach(s => {
    points = getPoints(state, s);
    Object.assign(s, {
      x: points[0][0],
      y: points[0][1],
      isLeft: s.locA < state.beams.totalLength / 2
    });
    if (state.solved) {
      if (s.type === 'Support') {
        Object.assign(s, {
          path: points[1][0] + ',' + points[1][1] + ' ' +
            points[2][0] + ',' + points[2][1],
          textA: {
            x: points[2][0],
            y: points[2][1] + (s.rF > 0 ? 20 : -10)
          }
        });
      } else if (s.type === 'Slide') {
        Object.assign(s, {
          path: 'M ' + points[1][0] + ' ' + points[1][1] + ' A ' +
            points[2][0] + ' ' + points[2][1] + (s.rM < 0 ? ' 1 1 0 ' : ' 0 1 1 ') +
            points[3][0] + ' ' + points[3][1],
          textA: {
            x: points[1][0],
            y: points[1][1] - 10
          }
        });
      } else if (s.type === 'Fixed') {
        Object.assign(s, {
          path: points[1][0] + ',' + points[1][1] + ' ' +
            points[2][0] + ',' + points[2][1],
          textA: {
            x: points[2][0],
            y: points[2][1] + (s.rF > 0 ? 20 : -10)
          },
          pathM: 'M ' + points[3][0] + ' ' + points[3][1] + ' A ' +
            points[4][0] + ' ' + points[4][1] + (s.rM < 0 ? ' 1 1 0 ' : ' 0 1 1 ') +
            points[5][0] + ' ' + points[5][1],
          textB: {
            x: points[3][0],
            y: points[3][1] - 10
          }
        });
      }
    }
  });

  loads.forEach(f => {
    if ((f.type === 'Distributed Force') || (f.type === 'Distributed Moment')) {
      points = getPoints(state, f);
      Object.assign(f, {
        path: points[0][0] + ',' + points[0][1] + ' ' +
          points[1][0] + ',' + points[1][1] + ' ' +
          points[2][0] + ',' + points[2][1] + ' ' +
          points[3][0] + ',' + points[3][1],
        textA: {
          x: points[1][0],
          y: points[1][1] + (f.valA > 0 ? 20 : -10)
        },
        textB: {
          x: points[2][0],
          y: points[2][1] + (f.valB > 0 ? 20 : -10)
        },
      });
    } else if (f.type === 'Force') {
      points = getPoints(state, f);
      Object.assign(f, {
        path: points[0][0] + ',' + points[0][1] + ' ' +
          points[1][0] + ',' + points[1][1],
        textA: {
          x: points[1][0],
          y: points[1][1] + (f.valA > 0 ? 20 : -10)
        }
      });
    } else if (f.type === 'Moment') {
      points = getPoints(state, f);
      Object.assign(f, {
        path: 'M ' + points[0][0] + ' ' + points[0][1] + ' A ' +
          points[1][0] + ' ' + points[1][1] + (f.valA < 0 ? ' 1 1 0 ' : ' 0 1 1 ') +
          points[2][0] + ' ' + points[2][1],
        textA: {
          x: points[0][0],
          y: points[0][1] - 10
        }
      });
    }
  });
}

const getPoints = (state, f) => {
  const
    getX = (x) => {
      return MARGIN_X + x * state.screen.scaleX;
    },
    getY = (y) => {
      return state.screen.maxY * (0.5 + y) + Math.sign(y) * 2;
    };

  if ((f.type === 'Distributed Force') || (f.type === 'Distributed Moment')) {
    let
      vA = Math.sign(f.valA) * (Math.abs(f.valA) >= Math.abs(f.valB) ? 1 : 0.5),
      vB = Math.sign(f.valB) * (Math.abs(f.valB) >= Math.abs(f.valA) ? 1 : 0.5);
    return [
      [getX(f.locA), getY(BEAM_HEIGHT * Math.sign(f.valA))],
      [getX(f.locA), getY(VECTOR_HEIGHT * vA)],
      [getX(f.locB), getY(VECTOR_HEIGHT * vB)],
      [getX(f.locB), getY(BEAM_HEIGHT * Math.sign(f.valB))],
    ];
  } else if (f.type === 'Moment') {
    let
      cX = getX(f.locA),
      cY = state.screen.maxY * 0.5,
      r = MOMENT_HEIGHT * state.screen.maxY;
    return [
      [cX, cY - r],
      [r, r],
      [cX - Math.sign(f.valA) * r, cY]
    ];
  } else if (f.type === 'Force') {
    return [
      [getX(f.locA), getY(BEAM_HEIGHT * Math.sign(f.valA))],
      [getX(f.locA), getY(VECTOR_HEIGHT * Math.sign(f.valA))]
    ];
  } else if (f.type === 'Support') {
    if (state.solved) {
      return [
        [getX(f.locA), getY(BEAM_HEIGHT)],
        [getX(f.locA), getY(BEAM_HEIGHT * Math.sign(f.rF))],
        [getX(f.locA), getY(VECTOR_HEIGHT * Math.sign(f.rF))]
      ];
    } else {
      return [
        [getX(f.locA), getY(BEAM_HEIGHT)]
      ];
    }
  } else if (f.type === 'Slide') {
    if (state.solved) {
      let
        cX = getX(f.locA),
        cY = state.screen.maxY * 0.5,
        r = MOMENT_HEIGHT * state.screen.maxY;
      return [
        [getX(f.locA), getY(0)],
        [cX, cY - r],
        [r, r],
        [cX - Math.sign(f.rM) * r, cY]
      ];
    } else {
      return [
        [getX(f.locA), getY(0)]
      ];
    }
  } else if (f.type === 'Fixed') {
    if (state.solved) {
      let
        cX = getX(f.locA),
        cY = state.screen.maxY * 0.5,
        r = MOMENT_HEIGHT * state.screen.maxY;
      return [
        [getX(f.locA), getY(0)],
        [getX(f.locA), getY(BEAM_HEIGHT * Math.sign(f.rF))],
        [getX(f.locA), getY(VECTOR_HEIGHT * Math.sign(f.rF))],
        [cX, cY - r],
        [r, r],
        [cX - Math.sign(f.rM) * r, cY]
      ];
    } else {
      return [
        [getX(f.locA), getY(0)]
      ];
    }
  }
}

/*Solution*/
const updateQMVGraphs = (state) => {
  getTransform(state.solution.graphQ, state);
  getTransform(state.solution.graphM, state);
  getTransform(state.solution.graphV, state);
};

const getTransform = (graph, state) => {
  const
    max = graph.pathMax,
    min = graph.pathMin,
    step = graphRound(Math.abs(max - min) / GRAPH_STEPS),
    mid = step * Math.round((max + min) / step) / 2;

  Object.assign(graph, {
    'step': step,
    'min': mid - step * (GRAPH_STEPS / 2 + 0.5),
    'max': mid + step * (GRAPH_STEPS / 2 + 0.5)
  });

  const
    scaleX = (state.screen.maxX - MARGIN_X) / state.beams.totalLength,
    scaleY = (GRAPH_HEIGHT - 5 * MARGIN_Y) / (graph.min - graph.max),
    getX = (x) => {
      return x * scaleX + 2 * MARGIN_X;
    },
    getY = (y) => {
      return y * scaleY + (GRAPH_HEIGHT / 2 - scaleY * (graph.max + graph.min) / 2);
    };

  Object.assign(graph, {
    'getX': getX,
    'getY': getY,
    'transform': 'translate(' + 2 * MARGIN_X + ',' + (GRAPH_HEIGHT / 2 - scaleY * (graph.max + graph.min) / 2) + ')' +
      ' scale(' + scaleX + ', ' + scaleY + ')'
  });
};

const graphRound = (n) => {
  const p = Math.floor(Math.log10(n));
  let s = n.toString();
  if (p < 0) {
    s = (n * 10 ** (-p)).toString();
  }
  let f = parseFloat(s[0]);

  if (s.length > 1) {
    let ff = s[1] === '.' ? parseFloat(s[2]) : parseFloat(s[1]);
    if (ff < 2.5) {
      f += 0.5;
    } else if (ff < 7.5) {
      f++;
    } else {
      f += 1.5;
    }
  } else {
    f += 0.5;
  }
  return f * 10 ** p;
};

export {
  drawBeams,
  drawForces,
  updateQMVGraphs
}