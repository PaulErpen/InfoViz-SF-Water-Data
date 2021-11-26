import ReactDOM from 'react-dom';
import React, { useState } from "react";
import ThreeDMap from './Components/ThreeDMap';
import "./styles/main.scss";
import TimeLine from './Components/TimeLine';
import { Provider } from 'react-redux';
import createInitializedStore from './store';

const MapVisualization = () => {
    const store = createInitializedStore();

    return <div id="main-view">
        <Provider store={store}>
            <ThreeDMap/>
            <TimeLine/>
        </Provider>
    </div>
}
window.addEventListener("load", () => {
    ReactDOM.render(<MapVisualization/>, document.getElementById("render-target"))
});
