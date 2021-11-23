var img_x = 3865;
var img_y = 3865;
var station_location = {
    "2": {
        x: 2424,
        y: 2573
    },
    "3": {
        x: 2364,
        y: 2541
    },
    "4": {
        x: 2340,
        y: 2466
    },
    "5": {
        x: 2294,
        y: 2367
    },
    "6": {
        x: 2251,
        y: 2311
    },
    "7": {
        x: 2179,
        y: 2261
    },
    "8": {
        x: 2102,
        y: 2220
    },
    "9": {
        x: 2099,
        y: 2149
    },
    "10": {
        x: 2081,
        y: 2085
    },
    "11": {
        x: 2007,
        y: 1996
    },
    "12": {
        x: 1953,
        y: 1956
    },
    "13": {
        x: 1882,
        y: 1919
    },
    "14": {
        x: 1806,
        y: 1899
    },
    "15": {
        x: 1687,
        y: 1902
    },
    "16": {
        x: 1624,
        y: 1945
    },
    "17": {
        x: 1569,
        y: 2031
    },
    "18": {
        x: 1527,
        y: 2089
    },
    "20": {
        x: 1502,
        y: 2159
    },
    "21": {
        x: 1471,
        y: 2216
    },
    "22": {
        x: 1441,
        y: 2273
    },
    "23": {
        x: 1391,
        y: 2332
    },
    "24": {
        x: 1334,
        y: 2380
    },
    "25": {
        x: 1303,
        y: 2425
    },
    "26": {
        x: 1275,
        y: 2467
    },
    "27": {
        x: 1253,
        y: 2525
    },
    "28": {
        x: 1240,
        y: 2592
    },
    "29": {
        x: 1239,
        y: 2670
    },
    "30": {
        x: 1242,
        y: 2733
    },
    "31": {
        x: 1240,
        y: 2792
    },
    "32": {
        x: 1237,
        y: 2849
    },
    "33": {
        x: 1235,
        y: 2907
    },
    "34": {
        x: 1234,
        y: 2699
    },
    "35": {
        x: 1232,
        y: 3012
    },
    "36": {
        x: 1231,
        y: 3062
    },
    "649": {
        x: 2532,
        y: 2677
    },
    "657": {
        x: 2760,
        y: 2692
    },
}

var bounds = [253700, 6637800, 273800, 6663700], // UTM 33N left, bottom, right, top
    boundsWidth = bounds[2] - bounds[0],
    boundsHeight = bounds[3] - bounds[1],
    cellSize = 100,
    xCells = boundsWidth / cellSize,
    yCells = boundsHeight / cellSize,
    sceneWidth = 100,
    sceneHeight = 100 * (boundsHeight / boundsWidth),
    boxSize = sceneWidth / xCells,
    valueFactor = 0.02,
    width  = window.innerWidth,
    height = window.innerHeight;

var colorScale = d3.scale.linear()
    .domain([0, 100, 617])
    .range(['#fec576', '#f99d1c', '#E31A1C']);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 20, width / height, 0.1, 1000 );
camera.position.set(0, -200, 120);

var controls = new THREE.TrackballControls(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild( renderer.domElement );

var geometry = new THREE.PlaneGeometry(sceneWidth, sceneHeight, 1, 1),
    material = new THREE.MeshBasicMaterial(),
    plane = new THREE.Mesh(geometry, material);

var textureLoader = new THREE.TextureLoader();
textureLoader.load('img/HighResSFBay_Rotate.png', function(texture) {
    material.map = texture;
    scene.add(plane);
});

var ambLight = new THREE.AmbientLight(0x777777);
scene.add(ambLight);

var dirLight = new THREE.DirectionalLight(0xcccccc, 1);
dirLight.position.set(-70, -50, 80);
scene.add(dirLight);


function render() {
    controls.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}   

render();

var csv = d3.dsv(' ', 'text/plain');

function spawnBars() {
    for (var key in station_location) {
        if (!station_location.hasOwnProperty(key)) {
            continue;
        }
        var value = Math.floor(Math.random() * 100); 
        var geometry = new THREE.BoxGeometry(boxSize, boxSize, value * valueFactor);
    
        var material = new THREE.MeshBasicMaterial({
            color: colorScale(value)
        });
    
        var cube = new THREE.Mesh(geometry, material);
        var sceneX = station_location[key].x / img_x * sceneWidth - sceneWidth *0.5;
        var sceneY = (img_y - station_location[key].y) / img_y * sceneHeight - sceneHeight *0.5;
        cube.position.set(sceneX, sceneY, value * valueFactor / 2);
    
        scene.add(cube);
    }
}

spawnBars();

// csv('data/Oslo_bef_100m_2015.csv').get(function(error, data) { // ru250m_2015.csv
//     for (var i = 0; i < data.length; i++) {
//         var id = data[i].rute_100m,
//             utmX = parseInt(id.substring(0, 7)) - 2000000 + cellSize, // First seven digits minus false easting
//             utmY = parseInt(id.substring(7, 14)) + cellSize, // Last seven digits
//             sceneX = (utmX - bounds[0]) / (boundsWidth / sceneWidth) - sceneWidth / 2,
//             sceneY = (utmY - bounds[1]) / (boundsHeight / sceneHeight) - sceneHeight / 2,
//             value = parseInt(data[i].sum);

//         var geometry = new THREE.BoxGeometry(boxSize, boxSize, value * valueFactor);

//         var material = new THREE.MeshPhongMaterial({
//             color: colorScale(value)
//         });

//         var cube = new THREE.Mesh(geometry, material);
//         cube.position.set(sceneX, sceneY, value * valueFactor / 2);

//         scene.add(cube);
//     }
// });