// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {

    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                    // Use Color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);           // Use UV debug color
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);    // Use texture 0
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);    // Use texture 1
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      gl_FragColor = vec4(1, .2, .2, 1);             // Error (red)
    }
  }`;

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
let g_globalAngleY = 0;

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

let g_headAnimation = false;
let g_leftLegAnimation = false;
let g_rightLegAnimation = false;
let g_rightShoulderAnimation = false;

// Vars for camera movement
let g_W = false;
let g_S = false;
let g_A = false;
let g_D = false;


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

  // Slider for view angle
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
  document.getElementById('yAngleSlide').addEventListener('mousemove', function() { g_globalAngleY = this.value; renderAllShapes(); });
  
}

function initTextures(texUnit, imgSrc) {
  let image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function() { sendImageToTexture( texUnit, image ); };
  image.src = imgSrc;
  return true;
}

function sendImageToTexture(texUnit, image) {
  let texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object');
    return false;
  }

  // Account for multiple textures
  let unit;
  let sample;
  switch(texUnit) {
    case 0:
      unit = gl.TEXTURE0;
      sample = u_Sampler0;
      break;
    case 1:
      unit = gl.TEXTURE1;
      sample = u_Sampler1;
      break;
    case 2:
      unit = gl.TEXTURE2;
      sample = u_Sampler2;
      break;
    default:
      null;
  }
  // Flip y-axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(sample, texUnit);
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

  camera = new Camera();

  document.onkeydown = function(ev) {
    if (ev.key == 'w') {
      g_W = true;
    } else if (ev.key == 's') {
      g_S = true;
    } else if (ev.key == 'a') {
      g_A = true;
    } else if (ev.key == 'd') {
      g_D = true;
    }
  };

  document.onkeyup = function(ev) {
    if (ev.key == 'w') {
      g_W = false;
    } else if (ev.key == 's') {
      g_S = false;
    } else if (ev.key == 'a') {
      g_A = false;
    } else if (ev.key == 'd') {
      g_D = false;
    }
  };

  initTextures(0, 'sky.jpg');
  initTextures(1, 'pattern.png');
  initTextures(2, 'purplehaze.jpg');

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

  // Update Camera
  movingCamera();

  /// Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function movingCamera() {
  if (g_W) {
    camera.moveForward();
  }
  if(g_S) {
    camera.moveBackward();
  }
  if (g_A) {
    camera.moveLeft();
  }
  if (g_D) {
    camera.moveRight();
  }
}


var g_shapesList = [];

function renderAllShapes() {
  // Checking time at the start of function
  var startTime = performance.now();

  gl.uniformMatrix4fv(u_ProjectionMatrix, false, camera.projMat.elements);

  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMat.elements);

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalAngleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);

  /*
  let c1 = new Cube();
  c1.matrix.translate(-0.35, -0.1, 0.0);
  c1.render(); */
  groundSky();
  buildMap();
  drawHead();
  drawBody();
  drawLegs();
  drawArms();
  
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




