import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import stationLocations from "./StationLocations";
import { Interaction } from '../../node_modules/three.interaction/src/index.js';
import * as THREE from 'three';
import TrackballControls from "three-trackballcontrols";
import { valueColors, valueScales } from "./MetaData";

const ReadCurrentTimeSubcomponent = () => {
    const currentTime = useSelector(state => {
        let optionalZero = state.currentTime.month < 10 ? "0" : "";
        return ""+state.currentTime.year+"-"+optionalZero+state.currentTime.month;
    });
    return <span id="current-time-subcomp" data-current-time={""+currentTime}></span>
}

const ReadCurrentDepthsSubcomponent = () => {
    const minDepth = useSelector(state => state.minDepth);
    const maxDepth = useSelector(state => state.maxDepth);
    return <span id="depth-subcomp" data-min-depth={""+minDepth} data-max-depth={""+maxDepth}></span>
}

const ReadSelectedValuesSubcomponent = () => {
    const selectedValues = useSelector(state => state.selectedValues);
    return <span id="selected-values-subcomp" data-selected-values={JSON.stringify(selectedValues)}></span>
}

const ThreeDMap = (props) => {
    let organizedData;
    let lastDate;
    let lastMinDepth;
    let lastMaxDepth;
    let lastSelectedValuesString;

    const threeDViewRef = useRef(null);
    
    const dispatch = useDispatch();

    const minBarHeight = 0.2;
    const img_x = 3865;
    const img_y = 3865;
    
    const barsByStation = {};

    const sceneWidth = 100;
    const sceneHeight = 100;

    const render = () => {
        controls.update();
        //check for changed filters
        if(!lastDate || !lastMinDepth || !lastMaxDepth || !lastSelectedValuesString) {
            lastDate = document.getElementById("current-time-subcomp").dataset["currentTime"];
            lastMinDepth = document.getElementById("depth-subcomp").dataset["minDepth"];
            lastMaxDepth = document.getElementById("depth-subcomp").dataset["maxDepth"];
            lastSelectedValuesString = document.getElementById("selected-values-subcomp").dataset["selectedValues"];
        } else if(lastDate != document.getElementById("current-time-subcomp").dataset["currentTime"]
                || lastMinDepth != document.getElementById("depth-subcomp").dataset["minDepth"] 
                || lastMaxDepth != document.getElementById("depth-subcomp").dataset["maxDepth"]
                || lastSelectedValuesString != document.getElementById("selected-values-subcomp").dataset["selectedValues"]) {
            lastDate = document.getElementById("current-time-subcomp").dataset["currentTime"];
            lastMinDepth = document.getElementById("depth-subcomp").dataset["minDepth"];
            lastMaxDepth = document.getElementById("depth-subcomp").dataset["maxDepth"];
            lastSelectedValuesString = document.getElementById("selected-values-subcomp").dataset["selectedValues"];
            scaleBars();
        }

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    
    const scene = new THREE.Scene();
    let camera;
    let controls;
    let interaction;
    const renderer = new THREE.WebGLRenderer();
    const geometry = new THREE.PlaneGeometry(sceneWidth, sceneHeight, 1, 1),
        material = new THREE.MeshBasicMaterial(),
        plane = new THREE.Mesh(geometry, material);
    const textureLoader = new THREE.TextureLoader();
    const ambLight = new THREE.AmbientLight(0x777777);
    const dirLight = new THREE.DirectionalLight(0xcccccc, 1);
    
    useEffect(() => {
        initialize3DView();
    });

    const initialize3DView = () => {
        let viewWrapper = threeDViewRef.current;
        let width  = viewWrapper.offsetWidth;
        let height = viewWrapper.offsetHeight;
        camera = new THREE.PerspectiveCamera( 20, width / height, 0.1, 1000 );
        controls = new TrackballControls(camera, viewWrapper);
        interaction = new Interaction(renderer, scene, camera);

        camera.position.set(0, -200, 120);
        renderer.setSize(width, height);
        viewWrapper.appendChild(renderer.domElement);
        textureLoader.load('img/HighResSFBay_Rotate.png', function(texture) {
            material.map = texture;
            scene.add(plane);
        });
        scene.add(ambLight);
        dirLight.position.set(-70, -50, 80);
        scene.add(dirLight);
        render();
        d3.csv(window.location.origin+'/data/sf_mean_by_month.csv')
        .then(function(data) {
            organizeData(data).then(processedData => {
                organizedData = processedData;
                dispatch({
                    type: "organizedStationData/set",
                    payload: organizedData
                });
                spawnBars(organizedData);
            });
        });
    }
    
    
    const organizeData = (data) => {
        return new Promise(function(resolve, reject) {
            var organizedBins = {};
            var months = new Set();
            for(var i = 0; i < data.length; i++) {
                //Initializing bin for station
                var currentStationNumber = data[i]["Station.Number"];
                if(currentStationNumber && !organizedBins[currentStationNumber]) {
                    organizedBins[currentStationNumber] = [];
                }
                //Pushing the data to the bin
                organizedBins[currentStationNumber].push(data[i]);

                //collecting yearMonthRange
                if(data[i]["MonthYear"]) {
                    months.add(data[i]["MonthYear"]);
                }
            }
            dispatch({
                type: "yearMonthRange/set",
                payload: Array.from(months)
            });
            resolve(organizedBins);
        });
    }
    
    const spawnBars = (data) => {
        for (var key in stationLocations) {
            if (!stationLocations.hasOwnProperty(key)) {
                continue;
            }
            //setup two bars per station
            barsByStation[key] = [];
            for(var i = 0; i < 4; i++) {
                var geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
            
                var material = new THREE.MeshBasicMaterial({
                    color: "#153828"
                });
            
                var cube = new THREE.Mesh(geometry, material);
                var sceneX = stationLocations[key].x / img_x * sceneWidth - sceneWidth *0.5;
                var sceneY = (img_y - stationLocations[key].y) / img_y * sceneHeight - sceneHeight *0.5;
                cube.position.set(sceneX, sceneY, 0);

                cube.userData = {
                    stationId: key
                }

                cube.on('click', function(ev) {
                    dispatch({
                        type: "activeStationId/set",
                        payload: ev.target.userData.stationId
                    });
                });

                scene.add(cube);
                barsByStation[key].push(cube);
            }
        }
        scaleBars();
    }

    const scaleBars = () => {
        for (const stationKey in stationLocations) {
            if (!stationLocations.hasOwnProperty(stationKey)) {
                continue;
            }
            var currentDataPoints = getDataPointsForDate(organizedData[stationKey+".0"]);
            var averages = averageValuesFromDataPoints(currentDataPoints, JSON.parse(lastSelectedValuesString));
            var i = 0;
            var prevHeight = 0;
            for(const valueKey in averages) {
                var value = averages[valueKey];
                let currentBar = barsByStation[stationKey][i];
                currentBar.scale.z = value * valueScales[valueKey] + minBarHeight;
                currentBar.position.z = (value * valueScales[valueKey] + minBarHeight) * 0.5 + prevHeight;
                prevHeight += currentBar.scale.z;
                currentBar.material.color.set(valueColors[valueKey]);
                i++;
            }
            for(; i<4; i++) {
                let currentBar = barsByStation[stationKey][i];
                currentBar.scale.z = 0;
                currentBar.position.z = 0;
            }
        }
    }

    const averageValuesFromDataPoints = (dataPoints, valueKeys) => {
        let averagesPerKey = {};
        for (const key in valueKeys) {
            if (!Object.hasOwnProperty.call(valueKeys, key)) { 
                continue;
            }
            const valueKey = valueKeys[key];
            if(!dataPoints || dataPoints.length == 0) {
                averagesPerKey[valueKey] = 0;
            } else {
                averagesPerKey[valueKey] = dataPoints.map(p => p[valueKey])
                    .map(f => parseFloat(f))
                    .reduce((a, b) => a + b, 0) / dataPoints.length;
            }
        }
        return averagesPerKey;
    }
    
    const getDataPointsForDate = (dataSeries) => {
        let data_points = [];
        for (var key in dataSeries) {
            if (dataSeries.hasOwnProperty(key)) {
                var dataPoint = dataSeries[key];
                if(dataPoint["MonthYear"] == lastDate 
                    && parseInt(dataPoint["Binned.Depth"]) <= 3 - lastMinDepth 
                    && parseInt(dataPoint["Binned.Depth"]) >= 3 - lastMaxDepth) {
                    data_points.push(dataPoint);
                }
            }
        }
        return data_points;
    }

    return <div id="three-d-view" ref={threeDViewRef}>
        <ReadCurrentTimeSubcomponent/>
        <ReadCurrentDepthsSubcomponent/>
        <ReadSelectedValuesSubcomponent/>
    </div>
}

export default ThreeDMap;