import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ActiveStationDialog.scss";

const ActiveStationDialog = () => {
    const dispatch = useDispatch();
    const [activeStationId, activeStationData] = useSelector(state => {
        return [
            state.activeStationId, 
            state.organizedStationData ? state.organizedStationData[state.activeStationId+".0"] : undefined
        ];
    });
    const svgRef = useRef(null);

    useEffect(() => {
        if(activeStationId) {
            //This is where your code is supposed to go Ben
            console.log("Running D3 line graph thingy!");
            //use svgRef.current to access the dom eloement that contains the svg element you want to manipulate with d3.js :)
            console.log(svgRef.current.width);
            //d3 is accessible via the d3 javascript object
            //This object contains all the data for the active station, its a huge array
            console.log(activeStationData)
            //uncomment the next line and you get a debug point in the browser when opening devTools ("F12")
            //debugger;
        }
    }, [activeStationId]);

    const close = () => {
        dispatch({
            type: "activeStationId/set",
            payload: undefined,
        });
    }

    return <div className={`active-station-dialog-wrapper ${activeStationId ? "visible" : ""}`}>
        <div className="active-station-dialog">
            <div className="active-station-dialog-inner">
                Station {activeStationId}
                <svg ref={svgRef} width="500" height="400"></svg>
            </div>
            <button type="button" onClick={() => close()}>Close</button>
        </div>
    </div>
}

export default ActiveStationDialog;