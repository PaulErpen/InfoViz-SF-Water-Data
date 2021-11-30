import React, { useRef, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/DepthDisplay.scss";

const DepthDisplay = () => {
    const dispatch = useDispatch();
    const minVal = useSelector(state => state.minDepth);
    const maxVal = useSelector(state => state.maxDepth);

    const minValRef = useRef(null);
    const maxValRef = useRef(null);

    const handleChange = (type, e) => {
        dispatch({
            type: type == "min" ? "minDepth/set" : "maxDepth/set",
            payload: e.target.value
        });
    }

    return <div className="depth-display">
        <input ref={minValRef} type="range" min="0" max="3" value={minVal} onChange={(e) => handleChange("min", e)}/>
        <input ref={maxValRef} type="range" min="0" max="3" value={maxVal} onChange={(e) => handleChange("max", e)}/>
        <div className="slider-bg"></div>
    </div>
};
    
export default DepthDisplay;