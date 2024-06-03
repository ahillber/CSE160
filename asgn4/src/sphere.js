class Sphere {
  constructor() {
      this.type = 'Sphere';
      this.color = [1.0,1.0,1.0,1.0];
      this.matrix = new Matrix4();
      this.textureNum = -2;
      this.verts32 = new Float32Array([]);
      this.shiny = 1;
  }

  render() {
    let rgba = this.color;

      // Pass the texture number
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform1i(u_isShiny, this.shiny);


    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    let d = Math.PI/10;
    let dd = Math.PI/10;

    for (let t=0; t < Math.PI; t+=d) {
      for (let r=0; r < (2*Math.PI); r+=d) {
        let p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
        let p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
        let p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
        let p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

        let v = [];
        let uv = [];
        v = v.concat(p1); uv = uv.concat([0,0]);
        v = v.concat(p2); uv = uv.concat([0,0]);
        v = v.concat(p4); uv = uv.concat([0,0]);

        gl.uniform4f(u_FragColor, 1,1,1,1);
        drawTriangle3DUVNormal(v, uv, v);

        v = [];
        uv = [];
        v = v.concat(p1); uv = uv.concat([0,0]);
        v = v.concat(p4); uv = uv.concat([0,0]);
        v = v.concat(p3); uv = uv.concat([0,0]);
        gl.uniform4f(u_FragColor, 1,0,0,1);
        drawTriangle3DUVNormal(v, uv, v);

      }
    }
  }
}

function drawTriangle3DUVNormal(verticies, uv, normals) {
  let n = verticies.length / 3;

  //Create buffers
  let vertexBuffer = gl.createBuffer();
  let uvBuffer = gl.createBuffer();
  let normalBuffer = gl.createBuffer();

  if (!vertexBuffer || !uvBuffer || !normalBuffer) {
    console.log('Failed to create a buffer object in drawTriangle3DUVNormal');
    return -1;
  }

  // For vertex buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // For uv buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  // For normal buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}