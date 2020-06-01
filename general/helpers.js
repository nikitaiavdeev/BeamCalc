const formatNumer = (inp) => {
    const
        v = parseFloat(inp.toFixed(12)),
        vAbs = Math.abs(v);
    if (vAbs >= 1000) {
        return v.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (vAbs === 0) {
        return 0;
    } else if (vAbs < 0.001) {
        return v.toExponential(3);
    } else if (vAbs < 1) {
        return parseFloat(v.toFixed(4));
    } else if (vAbs < 10) {
        return parseFloat(v.toFixed(3));
    } else if (vAbs < 100) {
        return parseFloat(v.toFixed(2));
    } else if (vAbs < 1000) {
        return parseFloat(v.toFixed(1));
    } else {
        return v;
    }
}

const objectClone = (aObject) => {
    if (!aObject) {
        return aObject;
    }

    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
        v = aObject[k];
        bObject[k] = (typeof v === "object") ? objectClone(v) : v;
    }

    return bObject;
}

export {
    formatNumer,
    objectClone
}