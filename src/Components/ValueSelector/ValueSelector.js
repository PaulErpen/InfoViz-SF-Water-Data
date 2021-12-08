import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { valueOptions } from "../MetaData";
import "./ValueSelector.scss";

const ValueSelector = () => {
    const selectedOption = useSelector(state => valueOptions.find(opt => opt.value.join(":") === state.selectedValues.join(":")));
    const dispatch = useDispatch();

    const handleChange = (ev) => {
        dispatch({
            type: "selectedValues/set",
            payload: ev.value
        });
    }

    return <div className="value-selector-wrapper">
        <h3>Value Selector</h3>
        <Select options={valueOptions} value={selectedOption} onChange={(ev) => {handleChange(ev)}}/>
    </div>
}

export default ValueSelector;