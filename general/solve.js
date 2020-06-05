import {
    drawForces,
    updateQMVGraphs
} from '../store/drawHelper.js';

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
        n = 0;

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
            displEq0(arr, ans, n++, state, s);
            angleEq0(arr, ans, n++, state, s);
        } else if ((s.type === 'Support') || (s.type === 'Linear Spring')) {
            displEq0(arr, ans, n++, state, s);
        } else if ((s.type === 'Slide') || (s.type === 'Torsion Spring')) {
            angleEq0(arr, ans, n++, state, s);
        }
    });

    loads.forEach(f => {
        ings = integral(beams, f, beamL, '');
        fSum += ings[0];
        mSum += ings[1];
    });

    ans.set([0, 0], -fSum);
    ans.set([1, 0], -mSum);

    const reactions = math.multiply(math.inv(arr), ans),
        v0 = reactions.get([0, 0]),
        t0 = reactions.get([1, 0]);

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
        x = 0,
        pathQ = 'M0,0',
        pathM = 'M0,0',
        pathV = 'M0,' + v0,
        maxQ, minQ, maxM, minM, maxV, minV;

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

        if ((q > maxQ) || (x === 0)) maxQ = q;
        if ((q < minQ) || (x === 0)) minQ = q;
        if (q + dq > maxQ) maxQ = q + dq;
        if (q + dq < minQ) minQ = q + dq;

        if ((m > maxM) || (x === 0)) maxM = m;
        if ((m < minM) || (x === 0)) minM = m;
        if (m + dm > maxM) maxM = m + dm;
        if (m + dm < minM) minM = m + dm;

        if ((v > maxV) || (x === 0)) maxV = v;
        if ((v < minV) || (x === 0)) minV = v;

        pathQ += 'L' + x + ',' + q + ((dq != 0) ? 'L' + x + ',' + (q + dq) : '');
        pathM += 'L' + x + ',' + m + ((dm != 0) ? 'L' + x + ',' + (m + dm) : '');
        pathV += 'L' + x + ',' + v;

        if (x === beamL) break;
        x += (x + dx <= beamL) ? dx : beamL - x;
    } while (x <= beamL);

    Object.assign(state.analysis.solution, {
        graphQ: {
            'path': pathQ,
            'pathMax': maxQ,
            'pathMin': minQ,
        },
        graphM: {
            'path': pathM,
            'pathMax': maxM,
            'pathMin': minM,
        },
        graphV: {
            'path': pathV,
            'pathMax': maxV,
            'pathMin': minV,
        }
    });

    updateQMVGraphs(state);
    Object.assign(state.analysis, {
        solved: true
    });
    drawForces(state);
}

const displEq0 = (arr, ans, n, state, inp) => {
    const
        beams = state.analysis.beams,
        supports = state.analysis.supports,
        loads = state.analysis.loads,
        x = inp.locA,
        beamL = state.analysis.totalLength,
        coeff = inp.type === 'Linear Spring' ? inp.stiff : 1;

    arr.set([0, 2 + n], coeff); //sum(F) = 0
    arr.set([1, 2 + n], coeff * (beamL - x)); //sum(M) = 0

    arr.set([2 + n, 0], 1); //v0
    arr.set([2 + n, 1], x); //theta0

    let i = 0,
        vSum = 0;

    supports.forEach(s => {
        if ((s !== inp) && (s.locA < x)) {
            if (s.type === 'Fixed') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Force',
                    valA: 1,
                    locA: s.locA
                }, x, 'Displacement'));
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Moment',
                    valA: 1,
                    locA: s.locA
                }, x, 'Displacement'));
            } else if (s.type === 'Support') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Force',
                    valA: 1,
                    locA: s.locA
                }, x, 'Displacement'));
            } else if (s.type === 'Slide') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Moment',
                    valA: 1,
                    locA: s.locA
                }, x, 'Displacement'));
            } else if (s.type === 'Linear Spring') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Force',
                    valA: s.stiff,
                    locA: s.locA
                }, x, 'Displacement'));
            } else if (s.type === 'Torsion Spring') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Moment',
                    valA: s.stiff,
                    locA: s.locA
                }, x, 'Displacement'));
            }
        } else if (s === inp) {
            if (inp.type === 'Linear Spring')
                arr.set([2 + n, 2 + i++], 1);
            else
                i++;
        }
    });

    loads.forEach(f => {
        vSum += integral(beams, f, x, 'Displacement');
    });

    ans.set([2 + n, 0], -vSum);
}

const angleEq0 = (arr, ans, n, state, inp) => {
    const
        beams = state.analysis.beams,
        supports = state.analysis.supports,
        loads = state.analysis.loads,
        x = inp.locA,
        coeff = inp.type === 'Torsion Spring' ? inp.stiff : 1;

    arr.set([1, 2 + n], -coeff); //sum(M) = 0

    arr.set([2 + n, 1], 1); //theta0

    let i = 0,
        tSum = 0;

    supports.forEach(s => {
        if ((s !== inp) && (s.locA < x)) {
            if (s.type === 'Fixed') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Force',
                    valA: 1,
                    locA: s.locA
                }, x, 'Angle'));
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Moment',
                    valA: 1,
                    locA: s.locA
                }, x, 'Angle'));
            } else if (s.type === 'Support') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Force',
                    valA: 1,
                    locA: s.locA
                }, x, 'Angle'));
            } else if (s.type === 'Slide') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Moment',
                    valA: 1,
                    locA: s.locA
                }, x, 'Angle'));
            } else if (s.type === 'Linear Spring') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Force',
                    valA: s.stiff,
                    locA: s.locA
                }, x, 'Angle'));
            } else if (s.type === 'Torsion Spring') {
                arr.set([2 + n, 2 + i++], integral(beams, {
                    type: 'Moment',
                    valA: s.stiff,
                    locA: s.locA
                }, x, 'Angle'));
            }
        } else if (s === inp) {
            if (inp.type === 'Torsion Spring')
                arr.set([2 + n, 2 + i++], 1);
            else
                i++;
        }
    });

    loads.forEach(f => {
        tSum += integral(beams, f, x, 'Angle');
    });

    ans.set([2 + n, 0], -tSum);
}

const integral = (beams, f, x, equation) => {
    let ans = equation === '' ? [0, 0, 0, 0] : 0;
    if (f.locA >= x) return ans;
    let
        ql = f.type == 'Distributed Force' ? f.valA : 0,
        qk = f.type == 'Distributed Force' ? (f.valB - f.valA) / (f.locB - f.locA) : 0,
        ml = f.type == 'Distributed Moment' ? -f.valA : 0,
        mk = f.type == 'Distributed Force' ? -(f.valB - f.valA) / (f.locB - f.locA) : 0,
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
                ml * (x1 - x0) ** 3 / 6 + mk * (x1 - x0) ** 4 / 24 +
                ql * (x1 - x0) ** 4 / 24 + qk * (x1 - x0) ** 5 / 120);
            t += ei * (
                m * (x1 - x0) +
                q * (x1 - x0) ** 2 / 2 +
                ml * (x1 - x0) ** 2 / 2 + mk * (x1 - x0) ** 3 / 6 +
                ql * (x1 - x0) ** 3 / 6 + qk * (x1 - x0) ** 4 / 24);

            m += q * (x1 - x0) +
                ml * (x1 - x0) + mk * (x1 - x0) ** 2 / 2 +
                ql * (x1 - x0) ** 2 / 2 + qk * (x1 - x0) ** 3 / 6;

            if (f.locB < x1) {
                if (f.locB > x0)
                    x0 = f.locB;

                v -= ei * (
                    ml * (x1 - x0) ** 3 / 6 + mk * (x1 - x0) ** 4 / 24 +
                    ql * (x1 - x0) ** 4 / 24 + qk * (x1 - x0) ** 5 / 120);
                t -= ei * (
                    ml * (x1 - x0) ** 2 / 2 + mk * (x1 - x0) ** 3 / 6 +
                    ql * (x1 - x0) ** 3 / 6 + qk * (x1 - x0) ** 4 / 24);
                q -= ql * (x1 - x0) + qk * (x1 - x0) ** 2 / 2;
                m -= ml * (x1 - x0) + mk * (x1 - x0) ** 2 / 2 +
                    ql * (x1 - x0) ** 2 / 2 + qk * (x1 - x0) ** 3 / 6;
            }

            q += ql * (x1 - x0) + qk * (x1 - x0) ** 2 / 2;

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
}

export {
    solve
}