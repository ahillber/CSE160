// Blocky Animal Stuff
function updateAnimationAngles() {
  /*
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
    */
   
}
  
function drawHead(x, y, z, r) {
  let head = new Cube();
  head.color = [0.96, 0.84, 0.59, 1.0];
  head.matrix.translate(x, y, z);
  head.matrix.scale(.8,.8,.8);
  head.matrix.translate(-0.35, -0.1, 0.0);
  head.matrix.rotate(r,0,1,0);
  let headCoords = new Matrix4(head.matrix);
  head.matrix.scale(0.75, 0.65, 0.7);
  //head.textureNum = 1;
  head.render();
  /*
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
  */

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
  //leftEye.textureNum = 0;
  leftEye.render();

  let rightEye = new Cube();
  rightEye.matrix = new Matrix4(headCoords);
  rightEye.color = [0,0,0,0.8];
  rightEye.matrix.translate(0.5,0.25,-0.01);
  rightEye.matrix.scale(0.15,g_blink, 0.1);
  //rightEye.textureNum = 0;
  rightEye.render();

  let nose = new Cube();
  nose.matrix = new Matrix4(headCoords);
  nose.color = [0.92, 0.51, 0.51, 1];
  nose.matrix.translate(0.3,0.15,-0.04);
  nose.matrix.scale(0.15,.2, 0.2);
  nose.render(); 
}

function drawBody(x, y, z) {
  // The clothes for body
  let body = new Cube();
  body.color = [0.76, 0.76, 0.76, 1];
  body.matrix.translate(x, y, z);
  body.matrix.scale(.8,.8,.8);
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

function drawLegs(x, y, z) {
  let leftLeg = new Cube();
  leftLeg.color = [0.16, 0.16, 0.16, 1];
  leftLeg.matrix.translate(x, y, z);
  leftLeg.matrix.scale(.8,.8,.8);
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
  rightLeg.matrix.translate(x, y, z);
  rightLeg.matrix.scale(.8,.8,.8);
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

function drawArms(x, y, z) {
  // Arms
  let rightShoulder = new Cube();
  rightShoulder.color = [0.58, 0.58, 0.58, 1];
  rightShoulder.matrix.translate(x, y, z);
  rightShoulder.matrix.scale(.8,.8,.8);
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
  leftShoulder.matrix.translate(x, y, z);
  leftShoulder.matrix.scale(.8,.8,.8);
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

function drawCharacter(x, y, z, r) {
  drawHead(x, y, z, r);
  drawBody(x, y, z);
  drawArms(x, y, z);
  drawLegs(x, y, z);
}