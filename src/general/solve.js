import {
  GRAPH_STEPS,
} from '../store/store.js'

const math = require('mathjs');

const solve = (state) => {
    const
      beams = state.analysis.beams,
      supports = state.analysis.supports,
      loads = state.analysis.loads,
      beamL = state.analysis.totalLength;

    let ings,
      fSum = 0,
      mSum = 0,
      n = 0,
      graphQ = {},
      graphM = {},
      graphV = {};

    supports.forEach(s => {
      if (s.type === 'Fixed') n += 2;
      else n++;
    });

    const
      arr = math.zeros(n + 2, n + 2),
      ans = math.zeros(n + 2, 1);

    n = 0;

    // no angle or displ in sum(F) = 0 or sum(M) = 0
    arr.set([0, 0], 0);
    arr.set([0, 1], 0);
    arr.set([1, 0], 0);
    arr.set([1, 1], 0);

    supports.forEach(s => {
      if (s.type === 'Fixed') {
        bcEq0(arr, ans, n++, state, s, 'Displacement');
        bcEq0(arr, ans, n++, state, s, 'Angle');
      } else if ((s.type === 'Support') || (s.type === 'Linear Spring')) {
        bcEq0(arr, ans, n++, state, s, 'Displacement');
      } else if ((s.type === 'Slide') || (s.type === 'Torsion Spring')) {
        bcEq0(arr, ans, n++, state, s, 'Angle');
      }
    });

    loads.forEach(f => {
      ings = integral(beams, f, beamL, 'Force/Moment');
      fSum += ings[0];
      mSum += ings[1];
    });

    ans.set([0, 0], -fSum);
    ans.set([1, 0], -mSum);

    let reactions, v0, t0

    try {
      reactions = math.multiply(math.inv(arr), ans);
      v0 = reactions.get([0, 0]);
      t0 = reactions.get([1, 0]);
    } catch (err) {
      Object.assign(state.snackbar, {
        message: 'Solver error',
        color: 'error',
        timeout: 3000,
        show: true
      });
      return null;
    }

    n = 0;
    supports.forEach(s => {
      if (s.type === 'Fixed') {
        Object.assign(s, {
          'rF': reactions.get([2 + n++, 0]),
          'rM': reactions.get([2 + n++, 0])
        });
      } else if (s.type === 'Support') {
        Object.assign(s, {
          'rF': reactions.get([2 + n++, 0]),
          'rM': 0
        });
      } else if (s.type === 'Slide') {
        Object.assign(s, {
          'rF': 0,
          'rM': reactions.get([2 + n++, 0])
        });
      } else if (s.type === 'Linear Spring') {
        Object.assign(s, {
          'rF': s.stiff * reactions.get([2 + n++, 0]),
          'rM': 0
        });
      } else if (s.type === 'Torsion Spring') {
        Object.assign(s, {
          'rF': 0,
          'rM': s.stiff * reactions.get([2 + n++, 0])
        });
      }
    });

    const
      nPoints = 300;


    let q, dq, m, dm, v, dx, lb,
      x = 0;

    do {
      q = 0;
      dq = 0;
      m = 0;
      dm = 0;
      lb = 0;
      v = v0 + t0 * x;
      dx = beamL / nPoints;

      for (const b of beams) {
        lb += b.length;
        if ((lb > x) && (lb < x + dx)) {
          dx = lb - x;
          break;
        } else if (lb > 0) {
          break;
        }
      }

      supports.forEach(s => {
        ings = integral(beams, s, x, '');
        q += ings[0];
        m -= ings[1];
        v += ings[3];

        if (s.locA === x) {
          dq += s.rF;
          dm += s.rM;
        }

        if ((s.locA > x) && (s.locA < x + dx)) {
          dx = s.locA - x;
        }
      });

      loads.forEach(f => {
        ings = integral(beams, f, x, '');
        q += ings[0];
        m -= ings[1];
        v += ings[3];

        if ((f.type === 'Force') && (f.locA === x))
          dq += f.valA;
        else if ((f.type === 'Moment') && (f.locA === x))
          dm += f.valA;

        if ((f.locA > x) && (f.locA < x + dx)) {
          dx = f.locA - x;
        }
        if (Object.prototype.hasOwnProperty.call(f, "locB")) {
          if ((f.locB > x) && (f.locB < x + dx)) {
            dx = f.locB - x;
          }
        }
      });

      pushData(graphQ, x, q, dq);
      pushData(graphM, x, m, dm);
      pushData(graphV, x, v);

      if (x === beamL) break;
      x += (x + dx <= beamL) ? dx : beamL - x;
    } while (x <= beamL);

    pushGraphMaxMin(graphQ);
    pushGraphMaxMin(graphM);
    pushGraphMaxMin(graphV);

    Object.assign(state.analysis.solution, {
      'graphQ': graphQ,
      'graphM': graphM,
      'graphV': graphV
    });

    Object.assign(state.analysis, {
      solved: true
    });
  },

  bcEq0 = (arr, ans, n, state, inp, bc) => {
    const
      beams = state.analysis.beams,
      supports = state.analysis.supports,
      loads = state.analysis.loads,
      x = inp.locA,
      beamL = state.analysis.totalLength,
      coeff = (inp.type === 'Linear Spring' || inp.type === 'Torsion Spring') ? inp.stiff : 1;

    if (bc === 'Displacement') {
      arr.set([0, 2 + n], coeff); //sum(F) = 0
      arr.set([1, 2 + n], coeff * (beamL - x)); //sum(M) = 0

      arr.set([2 + n, 0], 1); //v0
      arr.set([2 + n, 1], x); //theta0
    } else if (bc === 'Angle') {
      arr.set([1, 2 + n], -coeff); //sum(M) = 0

      arr.set([2 + n, 1], 1); //theta0
    }

    let i = 0,
      laodSum = 0;

    supports.forEach(s => {
      if ((s !== inp) && (s.locA < x)) {
        if (s.type === 'Fixed') {
          arr.set([2 + n, 2 + i++], integral(beams, {
            type: 'Force',
            valA: 1,
            locA: s.locA
          }, x, bc));
          arr.set([2 + n, 2 + i++], integral(beams, {
            type: 'Moment',
            valA: 1,
            locA: s.locA
          }, x, bc));
        } else if (s.type === 'Support') {
          arr.set([2 + n, 2 + i++], integral(beams, {
            type: 'Force',
            valA: 1,
            locA: s.locA
          }, x, bc));
        } else if (s.type === 'Slide') {
          arr.set([2 + n, 2 + i++], integral(beams, {
            type: 'Moment',
            valA: 1,
            locA: s.locA
          }, x, bc));
        } else if (s.type === 'Linear Spring') {
          arr.set([2 + n, 2 + i++], integral(beams, {
            type: 'Force',
            valA: s.stiff,
            locA: s.locA
          }, x, bc));
        } else if (s.type === 'Torsion Spring') {
          arr.set([2 + n, 2 + i++], integral(beams, {
            type: 'Moment',
            valA: s.stiff,
            locA: s.locA
          }, x, bc));
        }
      } else if (s === inp) {
        if ((inp.type === 'Linear Spring') || (inp.type === 'Torsion Spring'))
          arr.set([2 + n, 2 + i++], 1);
        else
          i++;
      }
    });

    loads.forEach(f => {
      laodSum += integral(beams, f, x, bc);
    });

    ans.set([2 + n, 0], -laodSum);
  },

  integral = (beams, f, x, equation) => {
    let ans = equation === '' ? [0, 0, 0, 0] : 0;
    if (f.locA > x) return ans;
    if ((f.locA == x) && (equation != 'Force/Moment')) return ans;
    let
      qa = f.type == 'Distributed Force' ? f.valA : 0,
      qb = f.type == 'Distributed Force' ? f.valB : 0,
      qk = f.type == 'Distributed Force' ? (qb - qa) / (f.locB - f.locA) : 0,
      ma = f.type == 'Distributed Moment' ? -f.valA : 0,
      mb = f.type == 'Distributed Moment' ? -f.valB : 0,
      mk = f.type == 'Distributed Moment' ? -(mb - ma) / (f.locB - f.locA) : 0,
      q = f.type == 'Force' ? f.valA : Object.prototype.hasOwnProperty.call(f, 'rF') ? f.rF : 0,
      m = f.type == 'Moment' ? -f.valA : Object.prototype.hasOwnProperty.call(f, 'rM') ? -f.rM : 0,
      x0 = 0,
      x1 = 0,
      t = 0,
      v = 0,
      ei;

    for (const b of beams) {
      x1 += b.length;
      ei = 1 / b.inertia / b.modulus / 10 ** 6; //msi to psi
      if (x1 > f.locA) {
        if (x < x1)
          x1 = x;
        if (f.locA > x0)
          x0 = f.locA;

        v += t * (x1 - x0) + ei * (
          m * (x1 - x0) ** 2 / 2 +
          q * (x1 - x0) ** 3 / 6 +
          ma * (x1 - x0) ** 3 / 6 + mk * (x1 - x0) ** 4 / 24 +
          qa * (x1 - x0) ** 4 / 24 + qk * (x1 - x0) ** 5 / 120);
        t += ei * (
          m * (x1 - x0) +
          q * (x1 - x0) ** 2 / 2 +
          ma * (x1 - x0) ** 2 / 2 + mk * (x1 - x0) ** 3 / 6 +
          qa * (x1 - x0) ** 3 / 6 + qk * (x1 - x0) ** 4 / 24);

        m += q * (x1 - x0) +
          ma * (x1 - x0) + mk * (x1 - x0) ** 2 / 2 +
          qa * (x1 - x0) ** 2 / 2 + qk * (x1 - x0) ** 3 / 6;

        q += qa * (x1 - x0) + qk * (x1 - x0) ** 2 / 2;

        qa += qk * (x1 - x0);
        ma += mk * (x1 - x0);
        if (f.locB < x1) {
          if (f.locB > x0)
            x0 = f.locB;

          v -= ei * (
            mb * (x1 - x0) ** 3 / 6 + mk * (x1 - x0) ** 4 / 24 +
            qb * (x1 - x0) ** 4 / 24 + qk * (x1 - x0) ** 5 / 120);
          t -= ei * (
            mb * (x1 - x0) ** 2 / 2 + mk * (x1 - x0) ** 3 / 6 +
            qb * (x1 - x0) ** 3 / 6 + qk * (x1 - x0) ** 4 / 24);
          q -= qb * (x1 - x0) + qk * (x1 - x0) ** 2 / 2;
          m -= mb * (x1 - x0) + mk * (x1 - x0) ** 2 / 2 +
            qb * (x1 - x0) ** 2 / 2 + qk * (x1 - x0) ** 3 / 6;
          qb += qk * (x1 - x0);
          mb += mk * (x1 - x0);
        }

        if (x === x1)
          break;
      }
      x0 = x1;
    }

    if (equation === 'Force')
      return q;
    else if (equation === 'Moment')
      return m;
    else if (equation === 'Angle')
      return t;
    else if (equation === 'Displacement')
      return v;
    else
      return [q, m, t, v];
  },

  pushData = (graph, x, y, dy = null) => {
    if (!graph.x) {
      graph.x = [];
      graph.y = [];
      graph.max = {};
      graph.max.x = x;
      graph.max.y = y;
      graph.min = {};
      graph.min.x = x;
      graph.min.y = y;
    }

    graph.x.push(x);
    graph.y.push(y);

    if (dy) {
      graph.x.push(x);
      graph.y.push(y + dy);
    }

    if (Math.max(y, y + dy) > graph.max.y) {
      graph.max.x = x;
      graph.max.y = Math.max(y, y + dy);
    }
    if (Math.min(y, y + dy) < graph.min.y) {
      graph.min.x = x;
      graph.min.y = Math.min(y, y + dy);
    }
  },

  pushGraphMaxMin = (graph) => {
    if (graph.max.y - graph.min.y == 0) {
      graph.max.y = 1
      graph.min.y = -1
    }
    const
      step = graphRound(Math.abs(graph.max.y - graph.min.y) / GRAPH_STEPS),
      mid = step * Math.round((graph.max.y + graph.min.y) / step) / 2;
    graph.step = step;
    graph.graphMin = mid - step * (GRAPH_STEPS / 2 + 0.5);
    graph.graphMax = mid + step * (GRAPH_STEPS / 2 + 0.5);
  },

  graphRound = (n) => {
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
  }

export {
  solve
}