class Cube {
    constructor() {
      this.type = 'Cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.buffer = null;
      this.uvBuffer = null;
      this.verticies = null;
      this.uvs = null;
      this.matrix = new Matrix4();
      this.textureNum = -2;
    }

    generateVerticies() {
      let v = [];
      // FRONT
      v.push(0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0);
      v.push(0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0);

      // Top
      v.push(1.0,1.0,0.0, 1.0,1.0,1.0, 0.0,1.0,0.0);
      v.push(0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0);

      // Back
      v.push (0.0,1.0,1.0, 1.0,1.0,1.0, 0.0,0.0,1.0);
      v.push(1.0,1.0,1.0, 1.0,0.0,1.0, 0.0,0.0,1.0);

      // Side of cube
      v.push(0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,0.0,1.0);
      v.push(0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0);
      // Right
      v.push(1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,1.0);
      v.push(1.0,1.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0);

      // Bottom of cube
      v.push(0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0);
      v.push(1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0);

      this.verticies = new Float32Array(v);
    }

    generateUvs() {
      let u = [];

      // FRONT
      u.push(0,0, 1,1, 1,0, 0,0, 0,1, 1,1);

      // TOP
      u.push(1,1, 1,0, 0,1, 0,1, 0,0, 1,0);

      // BACK
      u.push(0,1, 1,1, 0,0, 1,1, 1,0, 0,0);

      // LEFT
      u.push(0,0, 0,1, 1,0, 1,1, 0,1, 1,0);

      // RIGHT
      u.push(0,0, 0,1, 1,0, 0,1, 1,1, 1,0);

      // BOTTOM
      u.push(0,0, 1,0, 0,1, 1,0, 1,1, 0,1);
      
      this.uvs = new Float32Array(u);
    }
    
    render() {
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;

      if (this.verticies === null) {
        this.generateVerticies();
      }

      if (this.uvs === null) {
        this.generateUvs();
      }

      if(this.buffer === null) {
        this.buffer = gl.createBuffer();

        if(!this.buffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }
      }

      if(this.uvBuffer === null) {
        this.uvBuffer = gl.createBuffer();

        if (!this.uvBuffer) {
          console.log('Failed to create the buffer object (uv)');
          return -1;
        }
      }

      // Pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_Position);


      // Buffer ops for the uvs
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

      gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_UV);

      gl.drawArrays(gl.TRIANGLES, 0, this.verticies.length / 3);
    }
}