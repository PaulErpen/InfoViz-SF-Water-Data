const valueScales = {
    "Optical.Backscatter": 0.3,
    "Calculated.Oxygen": 0.125,
    "Calculated.SPM": 0.1,
    "Nitrate...Nitrite": 0.05,
    "Ammonium": 0.05,
    "Phosphate": 0.05,
    "Silicate": 0.05,
    "Discrete.Chlorophyll": 0.1,
}

const valueColors = {
    "Optical.Backscatter": "#515c54",
    "Calculated.Oxygen": "#00998f",
    "Calculated.SPM": "#153828",
    "Nitrate...Nitrite": "#d65e2f",
    "Ammonium": "#2adbb5",
    "Phosphate": "#bfaf00",
    "Silicate": "#275921",
    "Discrete.Chlorophyll": "#004a11",
}

module.exports = {
    valueScales: valueScales,
    valueColors: valueColors
}