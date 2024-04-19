// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Globals
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  // imporves performance
  gl = canvas.getContext('webgl', { perserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_size
  u_size = gl.getUniformLocation(gl.program, 'u_size');
  if (!u_size) {
    console.log('Failed to get the storage location of u_size');
    return;
  }

}

// Constants for shape
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global vars for UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_numSegments = 10;
let g_imgActive = 0;
let g_funMode = 0;

function addActionsForHtmlUI() {
  // Button color events
  document.getElementById('green').onclick = function () { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; g_funMode = 0;};
  document.getElementById('red').onclick = function () { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; g_funMode = 0;};
  document.getElementById('funMode').onclick = function () { g_funMode = 1; };
  document.getElementById('clearBtn').onclick = function () { g_imgActive = 0; gl.clearColor(0.0, 0.0, 0.0, 1.0); gl.clear(gl.COLOR_BUFFER_BIT); clearCanvas(); };

  // Buttons for shape events
  document.getElementById('pointBtn').onclick = function () { g_selectedType = POINT };
  document.getElementById('triangleBtn').onclick = function () { g_selectedType = TRIANGLE };
  document.getElementById('circleBtn').onclick = function () { g_selectedType = CIRCLE };

  // Button Event to draw Picture
  document.getElementById('picture').onclick = function () { g_imgActive = 1; clearCanvas(); };

  // Slider color events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; g_funMode = 0; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; g_funMode = 0; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; g_funMode = 0; });
  document.getElementById('segmentSlide').addEventListener('mouseup', function() { g_numSegments = this.value; });

  // Slider for size
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value });
}

function clearCanvas() {
  // Remove shapes from the list, then render the empty list
  g_shapesList = [];
  renderAllShapes();
}

function main() {

  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_size = []; //Array to store the size of a point

function click(ev) {
  // Extrack event click and return it in WebGL coordinates.
  let [x,y] = convertCoordsEventToGl(ev);

  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_numSegments;
  }
  point.position = [x,y];
  if (g_funMode == 1) {
    point.color = [Math.random(), Math.random(), Math.random(), 1.0]
  } else {
    point.color = [g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]];
  }
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // Store the coordinates to g_points array (now using a class instead of seperate lists)
  // g_points.push([x, y]);

  // Storing color, based on which color button clicked
  // g_colors.push(g_selectedColor); // causes bug since a pointer to array is being passed

  //g_colors.push([g_selectedColor[0], g_selectedColor[1], g_selectedColor[2], g_selectedColor[3]]);

  //g_size.push(g_selectedSize);

  // Store the coordinates to g_points array (Based on location)
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //  g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  // Function to draw shapes onto canvas
  renderAllShapes();

}

function convertCoordsEventToGl(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

function renderAllShapes() {
  // Checking time at the start of function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (g_imgActive == 1) {
    drawPicture();
  }

  // var len = g_points.length;
  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  //checking the time at the end of the function, and sending to webpage
  var duration = performance.now() - startTime;
  sendTextToHtml(`numdot ${len} ms: ${Math.floor(duration)} fps: ${Math.floor(1000/duration)}`, 'numdot');
}

function sendTextToHtml(text, htmlID) {
  var htmlElem = document.getElementById(htmlID);
  if (!htmlElem) {
    console.log(`Failed to get ${htmlID} from HTML`);
    return;
  }
  htmlElem.innerHTML = text;
}


function drawPicture () {
  //Drawing shape with at least 20 triangles

  gl.clearColor(0.0, 0.6, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw Grass
  gl.uniform4f(u_FragColor, 0.1, 0.9, 0.1, 1.0);
  drawTriangle([-1.0,-1.0,  1.0,-1.0,  -1.0,-0.5]);
  drawTriangle([-1.0,-0.5,  1.0,-1.0,  1.0,-0.5]);

  // Draw Pinwheels (sticks)
  gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
  drawTriangle([-0.5,-0.5,  -0.45,-0.5,  -0.5,-0.1]);
  drawTriangle([-0.5,-0.1,  -0.45,-0.5,  -0.45,-0.1]);

  // Draw Pinwheels (wheel)
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.35,0.0, -0.3,0.3]);

  gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.45,0.1, -0.65,0.35]);

  gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.6,0.075, -0.85,0.15]);

  gl.uniform4f(u_FragColor, 1.0, 0.0, 1.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.65,-0.035, -0.85,-0.15]);

  gl.uniform4f(u_FragColor, 0.0, 1.0, 1.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.6,-0.15, -0.8,-0.35]);

  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.55,-0.3, -0.5,-0.45]);

  gl.uniform4f(u_FragColor, 1.0, 0.6, 0.0, 1.0);
  drawTriangle([-0.47,-0.1, -0.42,-0.3, -0.25,-0.40]);

  gl.uniform4f(u_FragColor, 0.8, 0.0, 0.8, 1.0);
  drawTriangle([-0.47,-0.1, -0.3,-0.15, -0.1,-0.1]);


  // Draw Pinwheels (sticks)
  gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
  drawTriangle([0.5,-0.5,  0.45,-0.5,  0.5,-0.1]);
  drawTriangle([0.5,-0.1,  0.45,-0.5,  0.45,-0.1]);

  // Draw Pinwheels (wheel)
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
  drawTriangle([0.47,-0.1, 0.35,0.0, 0.3,0.3]);

  gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
  drawTriangle([0.47,-0.1, 0.45,0.1, 0.65,0.35]);

  gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
  drawTriangle([0.47,-0.1, 0.6,0.075, 0.85,0.15]);

  gl.uniform4f(u_FragColor, 1.0, 0.0, 1.0, 1.0);
  drawTriangle([0.47,-0.1, 0.65,-0.035, 0.85,-0.15]);

  gl.uniform4f(u_FragColor, 0.0, 1.0, 1.0, 1.0);
  drawTriangle([0.47,-0.1, 0.6,-0.15, 0.8,-0.35]);

  gl.uniform4f(u_FragColor, 0.0, 0.0, 1.0, 1.0);
  drawTriangle([0.47,-0.1, 0.55,-0.3, 0.5,-0.45]);

  gl.uniform4f(u_FragColor, 1.0, 0.6, 0.0, 1.0);
  drawTriangle([0.47,-0.1, 0.42,-0.3, 0.25,-0.40]);

  gl.uniform4f(u_FragColor, 0.8, 0.0, 0.8, 1.0);
  drawTriangle([0.47,-0.1, 0.3,-0.15, 0.1,-0.1]);

  // Drawing a sun
  gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);
  let d = 40/200.0; //delta
  let xy = [0.75, 0.75];

  let angleStep = 360 / 20;
  for (var angle = 0; angle < 360; angle = angle + angleStep) {
    let centerPt = [xy[0], xy[1]];
    let angle1 = angle;
    let angle2 = angle + angleStep;
    let vec1 = [Math.cos(angle1 * Math.PI/180)*d, Math.sin(angle1 * Math.PI/180)*d];
    let vec2 = [Math.cos(angle2 * Math.PI/180)*d, Math.sin(angle2 * Math.PI/180)*d];
    let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
    let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

    drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
  }
}