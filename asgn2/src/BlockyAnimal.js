// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

  gl.enable(gl.DEPTH_TEST);
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

  // Get storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  }

  // Set an initial value for this matrix to identify
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

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


let g_globalAngle = 0;

let g_headAngle = 0;
let g_leftLegAngle = 0;
let g_rightLegAngle = 0;
let g_leftShoudlerAngle = -10;
let g_leftElbowAngle = 0;
let g_rightShoulderAngle = 10;
let g_rightElbowAngle = 0;
let g_swordAngle = 0;

// Vars for poke
let g_pokeCount = 0;
let g_blink = 0.2;
let g_pokeAnimation = false;

let g_headAnimation = true;
let g_leftLegAnimation = true;
let g_rightLegAnimation = true;
let g_rightShoulderAnimation = true;


function addActionsForHtmlUI() {
  // Poke Animation
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey
  document.getElementById('webgl').onclick = function (e) {
    if (e.shiftKey && g_pokeCount === 0) {
      g_pokeAnimation = true;
      g_pokeCount = 1;
    } else if (e.shiftKey && g_pokeCount === 1) {
      g_pokeAnimation = false;
      g_pokeCount = 0;
    }
  };
  // Buttons for animation 
  document.getElementById('animationHeadOn').onclick = function () { g_headAnimation = true; };
  document.getElementById('animationHeadOff').onclick = function () { g_headAnimation = false; };

  document.getElementById('animationMagentaOn').onclick = function () { g_leftLegAnimation = true; };
  document.getElementById('animationMagentaOff').onclick = function () { g_leftLegAnimation = false; };

  document.getElementById('animationRightLegOn').onclick = function () { g_rightLegAnimation = true; };
  document.getElementById('animationRightLegOff').onclick = function () { g_rightLegAnimation = false; };

  document.getElementById('animationRightShoulderOn').onclick = function () { g_rightShoulderAnimation = true; };
  document.getElementById('animationRightShoulderOff').onclick = function () { g_rightShoulderAnimation = false; };

  // Slider for view angle
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });

  // Slider for limbs
  document.getElementById('headSlide').addEventListener('mousemove', function() { g_headAngle = this.value; renderAllShapes(); });
  document.getElementById('leftLegSlide').addEventListener('mousemove', function() { g_leftLegAngle = this.value; renderAllShapes(); });
  document.getElementById('rightLegSlide').addEventListener('mousemove', function() { g_rightLegAngle = this.value; renderAllShapes(); });

  document.getElementById('leftShoulderSlide').addEventListener('mousemove', function() { g_leftShoudlerAngle = this.value; renderAllShapes(); });
  document.getElementById('leftElbowSlide').addEventListener('mousemove', function() { g_leftElbowAngle = this.value; renderAllShapes(); });

  document.getElementById('rightShoulderSlide').addEventListener('mousemove', function() { g_rightShoulderAngle = this.value; renderAllShapes(); });
  document.getElementById('rightElbowSlide').addEventListener('mousemove', function() { g_rightElbowAngle = this.value; renderAllShapes(); });
  document.getElementById('swordSlide').addEventListener('mousemove', function() { g_swordAngle = this.value; renderAllShapes(); });

  
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

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //renderAllShapes();
  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Called by browser repeatedly whenever it is time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0 - g_startTime;

  updateAnimationAngles();

  // Draw everything
  renderAllShapes();

  /// Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}


var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_size = []; //Array to store the size of a point



function updateAnimationAngles() {
  if (g_leftLegAnimation) {
    g_leftLegAngle = (20 * Math.sin(g_seconds * 3));
  }
  if (g_rightLegAnimation) {
    g_rightLegAngle = (20 * Math.sin(g_seconds * 3));
  }
  if (g_headAnimation) {
    g_headAngle = (3 * Math.sin(g_seconds * 2));
  }
  if (g_pokeAnimation) {
    let temp = (0.2 * Math.sin(g_seconds * 2));
    if (temp > 0.0001) {
      g_blink = (0.2 * Math.sin(g_seconds * 2));
    }
  }
  if (g_rightShoulderAnimation) {
    g_rightShoulderAngle = (20 * Math.sin(g_seconds * 3));
  }
}

function drawHead() {
  let head = new Cube();
  head.color = [0.96, 0.84, 0.59, 1.0];
  head.matrix.translate(-0.35, -0.1, 0.0);
  head.matrix.rotate(g_headAngle,1,0,0);
  let headCoords = new Matrix4(head.matrix);
  head.matrix.scale(0.75, 0.65, 0.7);
  head.render();

  let horn = new Cone();
  horn.color = [0.76, 0.76, 0.76, 1];
  horn.matrix = new Matrix4(headCoords);
  horn.matrix.translate(0.2, 0.6, 0.35);
  horn.matrix.rotate(10, 0, 0, 1);
  horn.matrix.rotate(-90, 1, 0, 0);
  horn.matrix.scale(0.07, 0.1, 0.25);
  horn.render();

  let horn2 = new Cone();
  horn2.color = [0.76, 0.76, 0.76, 1];
  horn2.matrix = new Matrix4(headCoords);
  horn2.matrix.translate(0.5, 0.6, 0.35);
  horn2.matrix.rotate(-10, 0, 0, 1);
  horn2.matrix.rotate(-90, 1, 0, 0);
  horn2.matrix.scale(0.07, 0.1, 0.25);
  horn2.render();

  // Hair
  let hair1 = new Cube();
  hair1.color = [0.31,0.29,0.25,1];
  hair1.matrix = new Matrix4(headCoords);
  hair1.matrix.translate(0.2, 0.45, -0.1);
  hair1.matrix.scale(0.6, 0.3, 0.85);
  let hairCoords = new Matrix4(hair1.matrix);
  hair1.render();

  let hair2 = new Cube();
  hair2.color = [0.31,0.29,0.25,1];
  hair2.matrix = new Matrix4(hairCoords);
  hair2.matrix.translate(-.42, 0.29, 0.00001);
  hair2.matrix.scale(1, 0.7, 1);
  hair2.render();

  let hair3 = new Cube();
  hair3.color = [0.31,0.29,0.25,1];
  hair3.matrix = new Matrix4(hairCoords);
  hair3.matrix.translate(-0.2, 0.8, 0.15);
  hair3.matrix.scale(1, 0.4, 0.7);
  hair3.render();

  // Sideburns & Back of head
  let hair4 = new Cube();
  hair4.color = [0.31,0.29,0.25,1];
  hair4.matrix = new Matrix4(headCoords);
  hair4.matrix.translate(0.58,0.25,0.05);
  hair4.matrix.scale(0.25, 0.25, 0.3);
  hair4.render();

  let hair6 = new Cube();
  hair6.color = [0.31,0.29,0.25,1];
  hair6.matrix = new Matrix4(headCoords);
  hair6.matrix.translate(-0.08,0.25,0.05);
  hair6.matrix.scale(0.25, 0.35, 0.3);
  hair6.render();

  let hair7 = new Cube();
  hair7.color = [0.31,0.29,0.25,1];
  hair7.matrix = new Matrix4(hair6.matrix);
  hair7.matrix.translate(-0.05,0.25,0.7);
  hair7.render();

  let hair5 = new Cube();
  hair5.color = [0.31,0.29,0.25,1];
  hair5.matrix = new Matrix4(headCoords);
  hair5.matrix.translate(-0.05, 0.05, 0.5)
  hair5.matrix.scale(0.85, 0.7, 0.4);
  hair5.render();

  // Ears
  let rightEar = new Cube();
  rightEar.color = [0.68, 0.94, 0.94, 1.0];
  rightEar.matrix = new Matrix4(headCoords);
  rightEar.matrix.translate(0.55,0.18,0.35);
  rightEar.matrix.scale(0.3, 0.25, 0.1);
  rightEar.render();

  let leftEar = new Cube();
  leftEar.color = [0.68, 0.94, 0.94, 1.0];
  leftEar.matrix = new Matrix4(headCoords);
  leftEar.matrix.translate(-0.11,0.18,0.35);
  leftEar.matrix.scale(0.3, 0.25, 0.1);
  leftEar.render();


  // Face
  let leftEye = new Cube();
  leftEye.matrix = new Matrix4(headCoords);
  leftEye.color = [0,0,0,0.8];
  leftEye.matrix.translate(0.1,0.25,-0.01);
  leftEye.matrix.scale(0.15,g_blink, 0.1);
  leftEye.render();

  let rightEye = new Cube();
  rightEye.matrix = new Matrix4(headCoords);
  rightEye.color = [0,0,0,0.8];
  rightEye.matrix.translate(0.5,0.25,-0.01);
  rightEye.matrix.scale(0.15,g_blink, 0.1);
  rightEye.render();

  let nose = new Cube();
  nose.matrix = new Matrix4(headCoords);
  nose.color = [0.92, 0.51, 0.51, 1];
  nose.matrix.translate(0.3,0.15,-0.04);
  nose.matrix.scale(0.15,.2, 0.2);
  nose.render();
}

function drawBody() {
  // The clothes for body
  let body = new Cube();
  body.color = [0.76, 0.76, 0.76, 1];
  body.matrix.translate(-0.28, -0.3, 0.1);
  body.matrix.scale(0.6, 0.35, 0.55);
  body.render();

  // Belt
  let body2 = new Cube();
  body2.color = [0.23, 0.14, 0.137, 1];
  body2.matrix = new Matrix4(body.matrix);
  body2.matrix.translate(0.001, -0.35, 0.0001);
  body2.matrix.scale(0.99, 1, 1);
  body2.render();
  
  // Belt buckle
  let buckle1 = new Cube();
  buckle1.color = [0.94, 0.91, 0.58, 1];
  buckle1.matrix = new Matrix4(body2.matrix);
  buckle1.matrix.translate(0.4, 0.03, -0.07);
  buckle1.matrix.scale(.2, .3, 0.1);
  buckle1.render();

  let body3 = new Cube();
  body3.color = [0.76, 0.76, 0.76, 1];
  body3.matrix = new Matrix4(body.matrix);
  body3.matrix.translate(0.001, -0.6, 0.0002);
  body3.matrix.scale(1, .25, 1);
  body3.render();
}

function drawLegs() {
  let leftLeg = new Cube();
  leftLeg.color = [0.16, 0.16, 0.16, 1];
  leftLeg.matrix.translate(-0.2, -0.7, 0.25);
  leftLeg.matrix.rotate(g_leftLegAngle, 1, 0, 0);
  leftLeg.matrix.scale(0.15, 0.25, 0.2);
  leftLeg.render();
  
  let leftShoe = new Cube();
  leftShoe.color = [0.78, 0.78, 0.78, 1];
  leftShoe.matrix = new Matrix4(leftLeg.matrix);
  leftShoe.matrix.translate(-0.1, -0.6, -0.01);
  leftShoe.matrix.scale(1.2, 0.8, 1.1);
  leftShoe.render();

  let rightLeg = new Cube();
  rightLeg.color = [0.16, 0.16, 0.16, 1];
  rightLeg.matrix.translate(0.08, -0.7, 0.25);
  rightLeg.matrix.rotate(-g_rightLegAngle, 1, 0, 0);
  rightLeg.matrix.scale(0.15, 0.25, 0.2);
  rightLeg.render();

  let rightShoe = new Cube();
  rightShoe.color = [0.78, 0.78, 0.78, 1];
  rightShoe.matrix = new Matrix4(rightLeg.matrix);
  rightShoe.matrix.translate(-0.1, -0.6, -0.01);
  rightShoe.matrix.scale(1.2, 0.8, 1.1);
  rightShoe.render();
}

function drawArms() {
  // Arms
  let rightShoulder = new Cube();
  rightShoulder.color = [0.58, 0.58, 0.58, 1];
  rightShoulder.matrix.translate(0.26, -0.26, 0.28);
  rightShoulder.matrix.rotate(g_rightShoulderAngle, 1, 0, 0);
  rightShoulder.matrix.rotate(10, 0, 0, 1);
  rightShoulder.matrix.scale(0.2, 0.15, 0.2);
  rightShoulder.render();

  let rightElbow = new Cube();
  rightElbow.color = [0.36, 0.36, 0.36, 1];
  rightElbow.matrix = new Matrix4(rightShoulder.matrix);
  rightElbow.matrix.translate(0.1499, 0, 1);
  rightElbow.matrix.rotate(g_rightElbowAngle, 1, 0, 0);
  rightElbow.matrix.rotate(180, 1, 0, 0);
  rightElbow.matrix.scale(0.85, 2, 0.85);
  rightElbow.render();

  let leftShoulder = new Cube();
  leftShoulder.color = [0.58, 0.58, 0.58, 1];
  leftShoulder.matrix.translate(-0.42, -0.24, 0.28);
  leftShoulder.matrix.rotate(g_leftShoudlerAngle, 1, 0, 0);
  leftShoulder.matrix.rotate(-10, 0, 0, 1);
  leftShoulder.matrix.scale(0.2, 0.15, 0.2);
  leftShoulder.render();

  let leftElbow = new Cube();
  leftElbow.color = [0.36, 0.36, 0.36, 1];
  leftElbow.matrix = new Matrix4(leftShoulder.matrix);
  leftElbow.matrix.translate(-0.05, 0, 0.9);
  leftElbow.matrix.rotate(g_leftElbowAngle, 1, 0, 0);
  leftElbow.matrix.rotate(180, 1, 0, 0);
  leftElbow.matrix.scale(0.85, 2, 0.7);
  leftElbow.render();

  // Render a sword
  let sword = new Cube();
  sword.color = [0.58, 0.58, 0.58, 1];
  sword.matrix = new Matrix4(leftElbow.matrix);
  sword.matrix.rotate(g_swordAngle, 0, 1, 1);
  sword.matrix.translate(-0.5, 1.5, 0);
  sword.matrix.rotate(10, 0, 1, 0);
  sword.matrix.rotate(-80, 0, 0, 1);
  sword.matrix.scale(1.5, .1, 1);
  sword.render();

  let blade = new Cube();
  blade.color = [0.44, 0.6, 0.76, 1];
  blade.matrix = new Matrix4(sword.matrix);
  blade.matrix.translate(0.4, -12, 0.2);
  blade.matrix.scale(0.2, 12, 0.6);
  blade.render();

  let blade2 = new Cube();
  blade2.color = [0.75, 0.84, 0.9, 1];
  blade2.matrix = new Matrix4(sword.matrix);
  blade2.matrix.translate(0.6, -12, 0.2);
  blade2.matrix.scale(0.15, 12, 0.6);
  blade2.render();

  let blade3 = new Cube();
  blade3.color = [0.75, 0.84, 0.9, 1];
  blade3.matrix = new Matrix4(sword.matrix);
  blade3.matrix.translate(0.55, -13, 0.2);
  blade3.matrix.scale(0.2, 3, 0.7);
  blade3.render();

  let handle = new Cube();
  handle.color = [0.21, 0.34, 0.47, 1];
  handle.matrix = new Matrix4(sword.matrix);
  handle.matrix.translate(0.4, 0, 0.2);
  handle.matrix.scale(0.3, 5, 0.6);
  handle.render();
}

function renderAllShapes() {
  // Checking time at the start of function
  var startTime = performance.now();

  // Pass the mtrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);

  // var len = g_points.length;
  // var len = g_shapesList.length;
  // for(var i = 0; i < len; i++) {
  //  g_shapesList[i].render();
  // }

  drawHead();
  drawBody();
  drawLegs();
  drawArms();


  // A lot of rotating cubes (performance test)
  //var K = 1000;
  //for (let i = 1; i < K; i++) {
    //var c = new Cube();
    //c.matrix.translate(-.8, 1.9*i/K-1.0, 0);
    //c.matrix.rotate(g_seconds*100,1,1,1);
    //c.matrix.scale(.1, 0.5/K, 1.0/K);
    //c.render();
  //}

  //checking the time at the end of the function, and sending to webpage
  var duration = performance.now() - startTime;
  sendTextToHtml(`ms: ${Math.floor(duration)} fps: ${Math.floor(1000/duration)}`, 'numdot');
}

function sendTextToHtml(text, htmlID) {
  var htmlElem = document.getElementById(htmlID);
  if (!htmlElem) {
    console.log(`Failed to get ${htmlID} from HTML`);
    return;
  }
  htmlElem.innerHTML = text;
}
