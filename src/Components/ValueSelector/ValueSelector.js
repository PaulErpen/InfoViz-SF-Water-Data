import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import "./ValueSelector.scss";

const ValueSelector = () => {
    const options = [
        { value: ["Optical.Backscatter", "Calculated.Oxygen"], label: "Optical Backscatter/Oxygen" },
        { value: ["Calculated.SPM"], label: "Calculated SPM" }
    ];
    const value = useSelector(state => options.find(opt => opt.value.join(":") === state.selectedValues.join(":")));
    const dispatch = useDispatch();

    const handleChange = (ev) => {
        dispatch({
            type: "selectedValues/set",
            payload: ev.value
        });
    }

    return <div className="value-selector-wrapper">
        <h3>Value Selector</h3>
        <Select options={options} value={value} onChange={(ev) => {handleChange(ev)}}/>
    </div>
}

export default ValueSelector;