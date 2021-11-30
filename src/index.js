import ReactDOM from 'react-dom';
import React from "react";
import ThreeDMap from './Components/ThreeDMap';
import "./styles/main.scss";
import TimeLine from './Components/TimeLine';
import { Provider } from 'react-redux';
import createInitializedStore from './store';
import DepthDisplay from './Components/DepthDisplay';
import ActiveStationDialog from './Components/ActiveStationDialog/ActiveStationDialog';

const MapVisualization = () => {
    const store = createInitializedStore();

    return <div id="main-view">
        <Provider store={store}>
            <div className="three-d-view-wrapper">
                <ThreeDMap/>
                <DepthDisplay/>
                <ActiveStationDialog/>
            </div>
            <TimeLine/>
        </Provider>
    </div>
}
window.addEventListener("load", () => {
    ReactDOM.render(<MapVisualization/>, document.getElementById("render-target"))
});
