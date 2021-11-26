import ReactDOM from 'react-dom';
import React, { useState } from "react";
import ThreeDMap from './Components/ThreeDMap';

const MapVisualization = () => {
    let currentTime = {
        year: 2011,
        month: 5
    };
    const getCurrentTime = () => {
        let optionalZero = currentTime.month < 10 ? "0" : "";
        return ""+currentTime.year+"-"+optionalZero+currentTime.month;
    }
    const [selectedValue, setSelectedValue] = useState("Discrete.Oxygen");

    return <div>
        <ThreeDMap getCurrentTime={getCurrentTime} selectedValue={selectedValue}/>
    </div>
}
window.addEventListener("load", () => {
    ReactDOM.render(<MapVisualization/>, document.getElementById("render-target"))
});
