import React from "react"
import { useSelector } from "react-redux";
import { valueColors } from "../MetaData";
import "./Legend.scss";

const Legend = () => {
    const selectedValues = useSelector(state => state.selectedValues);

    return <div className="legend">
        <h3>Legend</h3>
        { selectedValues.map(valueKey => {
            return <div className="legend-item">
                <span className="color-indicator" style={{background: valueColors[valueKey]}}></span>
                &nbsp;
                <span>{valueKey}</span>
                <br/>
            </div>
        }) }
    </div>
}

export default Legend;