const SCI_UNIT_GROUPS = {
    length: {
        nm: 1e-3,
        um: 1,
        mm: 1e3,
        cm: 1e4,
        m: 1e6,
        km: 1e9
    },
    spatial_frequency: {
        cpnm: 1e3,
        cpum: 1.0,
        cpmm: 1e-3,
        cpm: 1e-6
    },
    time: {
        ms: 1,
        s: 1e3,
        min: 60e3,
        hour: 3600e3,
        us: 1e-3,
        ns: 1e-6
    },
    mass: {
        ug: 1e-3,
        mg: 1.0,
        g: 1e3,
        kg: 1e6
    },
    vis_length: {
        d: 1.0
    },
    vis_spatial_frequency: {
        cpd: 1.0
    },
    angle: {
        rad: 1.0,
        deg: Math.PI/180,
        grad: Math.PI/200
    },
    frequency: {
        Hz: 1.0,
        kHz: 1e3
    },
    voltage: {
        mV: 1.0,
        V: 1e3,
        uV: 1e-3
    },
    current: {
        pA: 1e-3,
        nA: 1.0,
        uA: 1e3,
        mA: 1e6,
        A: 1e9
    }
};

let SCI_UNITS = {};

for (let dimension in SCI_UNIT_GROUPS){
    for (let unit in SCI_UNIT_GROUPS[dimension]){
        SCI_UNITS[unit] = SCI_UNIT_GROUPS[dimension][unit];
    }
}

