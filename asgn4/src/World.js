// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;

  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;

  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform int u_whichTexture;
  uniform int u_isShiny;
  uniform vec3 u_lightPos;
  uniform vec3 u_lightColor;
  uniform vec3 u_cameraPos;
  uniform bool u_lightOn;

  void main() {

    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); //
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                    // Use Color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);           // Use UV debug color
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);    // Use texture 0
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);    // Use texture 1
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    } 
    else {
      gl_FragColor = vec4(1, .2, .2, 1);             // Error (red)
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // Eye
    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E,R), 0.0), 40.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * u_lightColor * 0.3;
    
    if (u_lightOn){
      if(u_isShiny == 1) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }
  }`;

let stats = new Stats();
stats.dom.style.left = "auto";
stats.dom.style.right = "0";
stats.showPanel(0); 
document.body.appendChild(stats.dom);
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
let g_Q = false;
let g_E = false;

let g_placeBlock = 1;

let g_normalOn = false;
let g_lightOn = true;
let g_lightAnimiation = true;

// holds light position
let g_lightPos = [0,2.5,3];

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

  // buttons for debugging normals
  document.getElementById('normalOn').onclick = function () {g_normalOn = true};
  document.getElementById('normalOff').onclick = function () {g_normalOn = false};
  
  //buttons for turing light on and off
  document.getElementById('lightOn').onclick = function () {g_lightOn = true};
  document.getElementById('lightOff').onclick = function () {g_lightOn = false};

  document.getElementById('lightAnimation').onclick = function () { g_lightAnimiation = true };
  document.getElementById('lightAnimationOff').onclick = function () { g_lightAnimiation = false };

  // buttons for choosing block material
  document.getElementById('stone').onclick = function () {g_placeBlock = 1; };
  document.getElementById('wood').onclick = function () {g_placeBlock = 2; };
  document.getElementById('grass').onclick = function () {g_placeBlock = 3; };
  document.getElementById('crate').onclick = function () {g_placeBlock = 4; };
  
  canvas.addEventListener('click', function () { deleteBlock(); renderAllShapes(); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key == 'x') {
      addBlock(); 
      renderAllShapes(); 
    }
  });

  // Slider for view angle
  document.getElementById('angleSlide').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
  //document.getElementById('yAngleSlide').addEventListener('mousemove', function() { g_globalAngleY = this.value; renderAllShapes(); });

  // Sliders for lights
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes(); }});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes(); } });
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) {g_lightPos[2] = this.value; renderAllShapes(); }});

  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  
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
    case 3:
      unit = gl.TEXTURE3;
      sample = u_Sampler3;
      break;
    case 4:
      unit = gl.TEXTURE4;
      sample = u_Sampler4;
      break;
    case 5:
      unit = gl.TEXTURE5;
      sample = u_Sampler5;
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
    } else if (ev.key == 'q') {
      g_Q = true;
    } else if (ev.key == 'e') {
      g_E = true;
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
    } else if (ev.key == 'q') {
      g_Q = false;
    } else if (ev.key == 'e') {
      g_E = false;
    }
  };

  initTextures(0, '../images/night.jpg');
  initTextures(1, '../images/brick.jpg');
  initTextures(2, '../images/bark.png');
  initTextures(3, '../images/grass.jpg');
  initTextures(4, '../images/crate.jpg');
  initTextures(5, '../images/gold.jpg');

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
  if (g_lightAnimiation === true ){
    animatedLight();
  }

  stats.begin();
  // Draw everything
  renderAllShapes();
  stats.end();
  // Update Camera
  movingCamera();

  /// Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function animatedLight() {
  // Small circle
  let radius = 5;

  g_lightPos[0] = radius * Math.cos(g_seconds * .5);
  //g_lightPos[1] = 4;
  g_lightPos[2] = radius * Math.sin(g_seconds * .5);
}

function movingCamera() {
  let collisionX = Math.round(camera.eye.elements[0]) + 16;
  let collisionY = Math.round(camera.eye.elements[2]) + 16;
  console.log(`x: ${collisionX} y: ${collisionY}`);
  if (collisionX > 1 && collisionY > 1){
    if (g_map[0][collisionX][collisionY] >= 1){
      camera.eye.elements[0] -= .1;
      camera.eye.elements[2] -= .1;
      return;
    }
  } else if (collisionX <= 1 || collisionY <= 1) {
    //console.log('rtue');
    if (g_map[0][collisionX][collisionY] >= 1){
      camera.eye.elements[0] += .3;
      camera.eye.elements[2] += .3;
      return;
    }
  }
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
  if (g_Q) {
    camera.panLeft();
  }
  if(g_E) {
    camera.panRight();
  }
}


var g_shapesList = [];
let loadMap = 0;
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

  
  groundSky();
  buildMap();
  //generateBoundary();
  drawMap();
  drawCharacter(-2, 0, 2, 15);
  drawCharacter(1.5, 0, 13, -8);
  drawCharacter(13, 0, -10, 0);
  drawCharacter(-11, 0, 3.1, 0);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);
  gl.uniform1i(u_lightOn, g_lightOn);
  gl.uniform3f(u_lightColor, g_selectedColor[0], g_selectedColor[1], g_selectedColor[2]);
  // Cube that represents the light
  let light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();
  
  if (loadMap === 0) {
    console.log(g_map);
    loadMap++;
  }
  
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




