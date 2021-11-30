import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import stationLocations from "./StationLocations";

const ReadCurrentTimeSubcomponent = () => {
    const currentTime = useSelector(state => {
        let optionalZero = state.currentTime.month < 10 ? "0" : "";
        return ""+state.currentTime.year+"-"+optionalZero+state.currentTime.month;
    });
    return <span id="current-time-subcomp" data-current-time={""+currentTime}></span>
}

const ThreeDMap = (props) => {
    let organizedData;
    let lastDate;

    const threeDViewRef = useRef(null);
    
    const selectedValue = useSelector(state => state.selectedValue);
    const dispatch = useDispatch();

    const img_x = 3865;
    const img_y = 3865;
    
    const barsByStation = {};

    const bounds = [253700, 6637800, 273800, 6663700], // UTM 33N left, bottom, right, top
        boundsWidth = bounds[2] - bounds[0],
        boundsHeight = bounds[3] - bounds[1],
        cellSize = 100,
        xCells = boundsWidth / cellSize,
        yCells = boundsHeight / cellSize,
        sceneWidth = 100,
        sceneHeight = 100,
        boxSize = sceneWidth / xCells,
        valueFactor = 0.5;
    
    const colorScale = d3.scale.linear()
        .domain([0, 100, 617])
        .range(['#fec576', '#f99d1c', '#E31A1C']);

    const render = () => {
        controls.update();
        if(!lastDate) {
            lastDate = document.getElementById("current-time-subcomp").dataset["currentTime"];
        } else if(lastDate != document.getElementById("current-time-subcomp").dataset["currentTime"]) {
            lastDate = document.getElementById("current-time-subcomp").dataset["currentTime"];
            scaleBars();
        }
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    
    const scene = new THREE.Scene();
    let camera;
    let controls;
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
        controls = new THREE.TrackballControls(camera, viewWrapper);
        
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
        var csv = d3.dsv(',', 'text/plain');
        csv('data/sf_mean_by_month.csv').get(function(error, data) {
            if(!error) {
                organizeData(data).then(processedData => {
                    organizedData = processedData;
                    spawnBars(organizedData);
                });
            } else {
                console.error("Could not load or parse 'data/sf_mean_by_month.csv': " + error);
            }
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
            var currentDataPoint = getDataPointForDate(data[key+".0"]);
            var value = 0;
            if(currentDataPoint) {
                value = currentDataPoint[selectedValue];
            }
    
            var geometry = new THREE.BoxGeometry(boxSize, boxSize, value * valueFactor);
        
            var material = new THREE.MeshBasicMaterial({
                color: colorScale(value)
            });
        
            var cube = new THREE.Mesh(geometry, material);
            var sceneX = stationLocations[key].x / img_x * sceneWidth - sceneWidth *0.5;
            var sceneY = (img_y - stationLocations[key].y) / img_y * sceneHeight - sceneHeight *0.5;
            cube.position.set(sceneX, sceneY, 0);
            cube.scale.z = value * valueFactor;

            scene.add(cube);
            barsByStation[key] = cube;
        }
    }

    const scaleBars = () => {
        for (var key in stationLocations) {
            if (!stationLocations.hasOwnProperty(key)) {
                continue;
            }
            var currentDataPoint = getDataPointForDate(organizedData[key+".0"]);
            var value = 0;
            if(currentDataPoint) {
                value = currentDataPoint[selectedValue];
            }
            let currentBar = barsByStation[key];
            currentBar.scale.z = value * valueFactor;
        }
    }
    
    const getDataPointForDate = (dataSeries) => {
        for (var key in dataSeries) {
            if (dataSeries.hasOwnProperty(key)) {
                var dataPoint = dataSeries[key];
                if(dataPoint["MonthYear"] == lastDate) {
                    return dataPoint;
                }
            }
        }
    }

    return <div id="three-d-view" ref={threeDViewRef}>
        <ReadCurrentTimeSubcomponent/>
    </div>
}

export default ThreeDMap;