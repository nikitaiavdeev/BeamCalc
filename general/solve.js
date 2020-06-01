import {
    drawForces,
    updateQMVGraphs
} from '../store/drawHelper.js';

const math = require('mathjs');

const solve = (state) => {
    const
        beams = state.beams.sections,
        supports = state.supports,
        loads = state.loads;

    let
        fSum = 0,
        mSum = 0,
        n = 0;

    loads.forEach(f => {
        if (f.type === 'Fixed') {
            n += 2;
        } else if ((f.type === 'Support') || (f.type === 'Slide')) {
            n++;
        }
    });

    const
        arr = math.zeros(n + 2, n + 2),
        ans = math.zeros(n + 2, 1);

    // no angle or displ in sum(F) = 0 or sum(M) = 0
    arr.set([0, 0], 0);
    arr.set([0, 1], 0);
    arr.set([1, 0], 0);
    arr.set([1, 1], 0);

    supports.forEach(s => {
        if (s.type === 'Fixed') {
            displEq0(arr, ans, n++, state, s);
            angleEq0(arr, ans, n++, state, s);
        } else if (s.type === 'Support') {
            displEq0(arr, ans, n++, state, s);
        } else if (s.type === 'Slide') {
            angleEq0(arr, ans, n++, state, s);
        }
    });

    loads.forEach(f => {
        if (f.type === 'Force') {
            fSum += f.valA;
            mSum += f.valA * f.locA;
        } else if (f.type === 'Moment') {
            mSum += f.valA;
        } else if (f.type === 'Distributed Force') {
            fSum += (f.valA + f.valB) * (f.locB - f.locA) / 2;
            mSum += f.valA * (f.locB ** 2 - f.locA ** 2) / 2 + (f.valB - f.valA) * (2 * f.locB ** 2 - f.locA * f.locB - f.locA ** 2) / 6;
        } else if (f.type === 'Distributed Moment') {
            mSum += (f.valA + f.valB) * (f.locB - f.locA) / 2;
        }
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
        }
    });

    const nPoints = 300,
        l = state.beams.totalLength;

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
        dx = l / nPoints;

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
            q += pointInteg(beams, s.rF, s.locA, x, 'Force', 'Force');
            m -= pointInteg(beams, s.rF, s.locA, x, 'Force', 'Moment');
            m -= pointInteg(beams, s.rM, s.locA, x, 'Moment', 'Moment');
            v += pointInteg(beams, s.rF, s.locA, x, 'Force', 'Displacement');
            v += pointInteg(beams, s.rM, s.locA, x, 'Moment', 'Displacement');

            if (s.locA === x) {
                dq += s.rF;
                dm += s.rM;
            }

            if ((s.locA > x) && (s.locA < x + dx)) {
                dx = s.locA - x;
            }
        });

        loads.forEach(f => {
            if (f.type === 'Force') {
                q += pointInteg(beams, f.valA, f.locA, x, 'Force', 'Force');
                m -= pointInteg(beams, f.valA, f.locA, x, 'Force', 'Moment');
                v += pointInteg(beams, f.valA, f.locA, x, 'Force', 'Displacement');

                if (f.locA === x) {
                    dq += f.valA;
                }
            } else if (f.type === 'Moment') {
                m += pointInteg(beams, f.valA, f.locA, x, 'Moment', 'Moment');
                v += pointInteg(beams, f.valA, f.locA, x, 'Moment', 'Displacement');

                if (f.locA === x) {
                    dm += f.valA;
                }
            } else if (f.type === 'Distributed Force') {
                q += distributedInteg(beams, f, x, 'Force', 'Force');
                m -= distributedInteg(beams, f, x, 'Force', 'Moment');
                v += distributedInteg(beams, f, x, 'Force', 'Displacement');
            } else if (f.type === 'Distributed Moment') {
                m -= distributedInteg(beams, f, x, 'Moment', 'Moment');
                v += distributedInteg(beams, f, x, 'Moment', 'Displacement');
            }
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

        if (x === l) break;
        x += (x + dx <= l) ? dx : l - x;
    } while (x <= l);

    Object.assign(state.solution, {
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
    state.solved = true;
    drawForces(state);
}

const displEq0 = (arr, ans, n, state, inp) => {
    const
        beams = state.beams.sections,
        supports = state.supports,
        loads = state.loads,
        x = inp.locA;

    arr.set([0, 2 + n], 1); //sum(F) = 0
    arr.set([1, 2 + n], x); //sum(M) = 0

    arr.set([2 + n, 0], 1); //v0
    arr.set([2 + n, 1], x); //theta0

    let i = 0,
        vSum = 0;

    supports.forEach(s => {
        if (s !== inp) {
            if ((s.type === 'Fixed') && (s.locA < x)) {
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Force', 'Displacement'));
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Moment', 'Displacement'));
            } else if ((s.type === 'Support') && (s.locA < x)) {
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Force', 'Displacement'));
            } else if ((s.type === 'Slide') && (s.locA < x)) {
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Moment', 'Displacement'));
            }
        } else {
            i++;
        }
    });

    loads.forEach(f => {
        if (f.type === 'Force') vSum += pointInteg(beams, f.valA, f.locA, x, 'Force', 'Displacement');
        else if (f.type === 'Moment') vSum += pointInteg(beams, f.valA, f.locA, x, 'Moment', 'Displacement');
        else if (f.type === 'Distributed Force') vSum += distributedInteg(beams, f, x, 'Force', 'Displacement');
        else if (f.type === 'Distributed Moment') vSum += distributedInteg(beams, f, x, 'Moment', 'Displacement');
    });

    ans.set([2 + n, 0], -vSum);
}

const angleEq0 = (arr, ans, n, state, inp) => {
    const
        beams = state.beams.sections,
        supports = state.supports,
        loads = state.loads,
        x = inp.locA;

    arr.set([1, 2 + n], 1); //sum(M) = 0

    arr.set([2 + n, 1], 1); //theta0

    let i = 0,
        tSum = 0;

    supports.forEach(s => {
        if (s !== inp) {
            if ((s.type === 'Fixed') && (s.locA < x)) {
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Force', 'Angle'));
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Moment', 'Angle'));
            } else if ((s.type === 'Support') && (s.locA < x)) {
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Force', 'Angle'));
            } else if ((s.type === 'Slide') && (s.locA < x)) {
                arr.set([2 + n, 2 + i++], pointInteg(beams, 1, s.locA, x, 'Moment', 'Angle'));
            }
        } else {
            i++;
        }
    });

    loads.forEach(f => {
        if (f.type === 'Force') tSum += pointInteg(beams, f.valA, f.locA, x, 'Force', 'Angle')
        else if (f.type === 'Moment') tSum += pointInteg(beams, f.valA, f.locA, x, 'Moment', 'Angle');
        else if (f.type === 'Distributed Force') tSum += distributedInteg(beams, f, x, 'Force', 'Angle');
        else if (f.type === 'Distributed Moment') tSum += distributedInteg(beams, f, x, 'Moment', 'Angle');
    });

    ans.set([2 + n, 0], -tSum);
}

const pointInteg = (beams, v, loc, x, load, equation) => {
    if (loc >= x) return 0;

    let
        p = (load === 'Moment') ? 0 : 1,
        s = (load === 'Moment') ? -1 : 1,
        x0 = 0,
        x1 = 0,
        a = 0,
        ei;

    if (equation === 'Force') {
        p--;
    } else if (equation === 'Angle') {
        p++;
        s *= 10 ** -3; //msi to psi
    } else if (equation === 'Displacement') {
        p += 2;
        s *= 10 ** -3; //msi to psi 
    }

    const
        d = 1 / factorial(p);

    if ((equation === 'Force') || (equation === 'Moment')) {
        a += v * (x - loc) ** p * d;
    } else {
        for (const b of beams) {
            x1 += b.length;
            ei = 1 / b.inertia / b.modulus;
            if (x1 > loc) {
                if (x < x1)
                    x1 = x;
                if (x0 > loc)
                    a += v * ((x1 - loc) ** p - (x0 - loc) ** p) * ei * d;
                else
                    a += v * (x1 - loc) ** p * ei * d;
                if (x === x1) {
                    break;
                }
            }
            x0 = x1;
        }
    }

    return s * a;
}

const distributedInteg = (beams, f, x, load, equation) => {
    if (f.locA >= x) return 0;
    let
        p = (load === 'Moment') ? 1 : 2,
        p1 = (load === 'Moment') ? 2 : 3,
        s = (load === 'Moment') ? -1 : 1,
        x0 = 0,
        x1 = 0,
        a = 0,
        ei;

    if (equation === 'Force') {
        p--;
        p1--;
    } else if (equation === 'Angle') {
        p++;
        p1++;
        s *= 10 ** -3; //msi to psi
    } else if (equation === 'Displacement') {
        p += 2;
        p1 += 2;
        s *= 10 ** -3; //msi to psi 
    }

    const
        d = 1 / factorial(p),
        d1 = 1 / factorial(p1),
        v = f.valA,
        vB = f.valB,
        k = (f.valB - f.valA) / (f.locB - f.locA);

    if ((equation === 'Force') || (equation === 'Moment')) {
        a += v * (x - f.locA) ** p * d;
        a += k * (x - f.locA) ** p1 * d1;
        if (f.locB < x) {
            a -= vB * (x - f.locB) ** p * d;
            a -= k * (x - f.locB) ** p1 * d1;
        }
    } else {
        for (const b of beams) {
            x1 += b.length;
            ei = 1 / b.inertia / b.modulus;
            if (x1 > f.locA) {
                if (x < x1)
                    x1 = x;
                if (x0 > f.locA) {
                    a += v * ((x1 - f.locA) ** p - (x0 - f.locA) ** p) * ei * d;
                    a += k * ((x1 - f.locA) ** p1 - (x0 - f.locA) ** p1) * ei * d1;

                    if (f.locB < x1) {
                        a -= vB * ((x1 - f.locB) ** p - (x0 - f.locB) ** p) * ei * d;
                        a -= k * ((x1 - f.locB) ** p1 - (x0 - f.locB) ** p1) * ei * d1;
                    }
                } else {
                    a += v * (x1 - f.locA) ** p * ei * d;
                    a += k * (x1 - f.locA) ** p1 * ei * d1;

                    if (f.locB < x1) {
                        a -= vB * (x1 - f.locB) ** p * ei * d;
                        a -= k * (x1 - f.locB) ** p1 * ei * d1;
                    }
                }
                if (x === x1)
                    break;
            }
            x0 = x1;
        }
    }

    return s * a;
}

const factorial = (num) => {
    if (num === 0 || num === 1)
        return 1;
    for (var i = num - 1; i >= 1; i--) {
        num *= i;
    }
    return num;
}

export {
    solve
}