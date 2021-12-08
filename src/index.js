import ReactDOM from 'react-dom';
import React from "react";
import ThreeDMap from './Components/ThreeDMap';
import "./styles/main.scss";
import TimeLine from './Components/TimeLine';
import { Provider } from 'react-redux';
import createInitializedStore from './store';
import DepthDisplay from './Components/DepthDisplay/DepthDisplay';
import ActiveStationDialog from './Components/ActiveStationDialog/ActiveStationDialog';
import ValueSelector from './Components/ValueSelector/ValueSelector';
import Legend from './Components/Legend/Legend';

const MapVisualization = () => {
    const store = createInitializedStore();

    return <div id="main-view">
        <Provider store={store}>
            <div className="three-d-view-wrapper">
                <ThreeDMap/>
                <ActiveStationDialog/>
                <div className="controls-container">
                    <ValueSelector/>
                    <div className="legend-wrapper">
                        <Legend/>
                    </div>
                    <DepthDisplay/>
                </div>
            </div>
            <TimeLine/>
        </Provider>
    </div>
}
window.addEventListener("load", () => {
    ReactDOM.render(<MapVisualization/>, document.getElementById("render-target"))
});
