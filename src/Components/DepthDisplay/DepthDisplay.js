import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DepthDisplay.scss";

const DepthDisplay = () => {
    const dispatch = useDispatch();
    const minVal = useSelector(state => state.minDepth);
    const maxVal = useSelector(state => state.maxDepth);

    const binnedDepths = ["0-20 ft.", "20-40 ft.", "40-60 ft.", "60-80 ft."];

    const minValRef = useRef(null);
    const maxValRef = useRef(null);

    const handleChange = (type, e) => {
        if(type == "min" && e.target.value > maxVal) {
            dispatch({
                type: "maxDepth/set",
                payload: e.target.value
            });
        } else if(e.target.value < minVal) {
            dispatch({
                type: "minDepth/set",
                payload: e.target.value
            });
        }
        dispatch({
            type: type == "min" ? "minDepth/set" : "maxDepth/set",
            payload: e.target.value
        });
    }

    return <div className="depth-display">
        <h3>Depth</h3>
        <input id="min-value" ref={minValRef} 
            type="range" 
            min="0" 
            max="3" value={minVal} 
            onChange={(e) => handleChange("min", e)}/>
        <input id="max-value" 
            ref={maxValRef} type="range" 
            min="0" 
            max="3" value={maxVal} 
            onChange={(e) => handleChange("max", e)}/>
        <div className="slider-bg"></div>
        <div className="depth-indicators">
            {binnedDepths.map(depth => {
                return <div key={depth} className="depth-indicator">
                    {depth}
                </div>
            })}
        </div>
    </div>
};
    
export default DepthDisplay;