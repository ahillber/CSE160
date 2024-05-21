class Camera {
  constructor() {
    this.type = 'Camera';
    this.fov = 60;
    this.eye = new Vector3([0,0,-3]);
    this.at = new Vector3([0,0,-1.5]);
    this.up = new Vector3([0,1,0]);

    //Alpha (for pan funcs)
    this.alpha = 1;

    this.projMat = new Matrix4();
    this.projMat.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);

    this.viewMat = new Matrix4();
    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }


  moveForward() {
    let d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize();
    // Mult by speed if necessary
    d.mul(0.05);

    //console.log(this.eye.elements[2]);
    this.eye.add(d);
    this.at.add(d);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }

  moveBackward() {
    let d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize();
    // Mult by speed if necessary
    d.mul(0.05);

    this.eye.sub(d);
    this.at.sub(d);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }

  moveLeft() {
    let d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);

    let s = Vector3.cross(this.up, d);
    s.normalize();
    s.mul(0.05);

    this.eye.add(s);
    this.at.add(s);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }

  moveRight() {
    let d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);

    let s = Vector3.cross(d, this.up);
    s.normalize();
    s.mul(0.05);

    this.eye.add(s);
    this.at.add(s);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }

  panLeft() {
    let d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);

    let rotationMatrix = new Matrix4();
    rotationMatrix.rotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    let fPrime = rotationMatrix.multiplyVector3(d);

    this.at.set(this.eye);
    this.at.add(fPrime);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }

  panRight() {
    let d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);

    let rotationMatrix = new Matrix4();
    rotationMatrix.rotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

    let fPrime = rotationMatrix.multiplyVector3(d);

    this.at.set(this.eye);
    this.at.add(fPrime);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
      this.at.elements[0],this.at.elements[1],this.at.elements[2],
      this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }
}