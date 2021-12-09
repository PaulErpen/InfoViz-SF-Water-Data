const valueOptions = [
    { value: ["Nitrate...Nitrite", "Ammonium", "Phosphate", "Silicate"], label: "Agricultural pollutants" },
    { value: ["Calculated.Oxygen"], label: "Oxygen" },
    { value: ["Discrete.Chlorophyll"], label: "Chlorophyl" },
];

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

const labelToUnitMapping = {
    "Agricultural pollutants": "Micromolar",
    "Oxygen": "micrograms/L",
    "Chlorophyl": "micrograms/L",
    "Nitrate...Nitrite": "Micromolar",
    "Ammonium": "Micromolar",
    "Phosphate": "Micromolar",
    "Silicate": "Micromolar",
    "Calculated.Oxygen": "micrograms/L",
    "Discrete.Chlorophyll": "micrograms/L",
}

module.exports = {
    valueScales: valueScales,
    valueColors: valueColors,
    valueOptions: valueOptions,
    labelToUnitMapping: labelToUnitMapping
}