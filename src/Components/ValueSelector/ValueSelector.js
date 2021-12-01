import React from "react";
import Select from "react-select/dist/declarations/src/Select";

const ValueSelector = () => {
    const options = [
        { value: ["Optical.Backscatter", "Calculated.Oxygen"], label: "Optical Backscatter/Oxygen" },
        { value: ["Calculated.SPM"], label: "Calculated SPM" }
    ];

    return <div className="value-selector-wrapper">
        <Select options={} />
    </div>
}

export default ValueSelector;