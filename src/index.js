import ReactDOM from 'react-dom';
import React, { useState } from "react";
import ThreeDMap from './Components/ThreeDMap';

const MapVisualization = () => {
    const [currentTime, setCurrentTime] = useState({
        year: 2011,
        month: "05"
    });
    const [selectedValue, setSelectedValue] = useState("Discrete.Oxygen");

    return <div>
        <ThreeDMap currentTime={currentTime} selectedValue={selectedValue}/>
    </div>
}
window.addEventListener("load", () => {
    ReactDOM.render(<MapVisualization/>, document.getElementById("render-target"))
});
