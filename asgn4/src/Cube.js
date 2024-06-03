class Cube {
    constructor() {
      this.type = 'Cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.buffer = null;
      this.uvBuffer = null;
      this.normalBuffer = null;
      this.verticies = null;
      this.uvs = null;
      this.normals = null;
      this.matrix = new Matrix4();
      this.textureNum = -2;
      this.shiny = 1;
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

    generateNormals() {
      let n = [];
      //Front
      n.push(0,0,-1, 0,0,-1, 0,0,-1);
      n.push(0,0,-1, 0,0,-1, 0,0,-1);

      // Top
      n.push(0,1,0, 0,1,0, 0,1,0);
      n.push(0,1,0, 0,1,0, 0,1,0);

      // Back
      n.push(0,0,1, 0,0,1, 0,0,1);
      n.push(0,0,1, 0,0,1, 0,0,1);

      // Side of cube  (Left)
      n.push(-1,0,0, -1,0,0, -1,0,0);
      n.push(-1,0,0, -1,0,0, -1,0,0);
      
      // Right
      n.push(1,0,0, 1,0,0, 1,0,0);
      n.push(1,0,0, 1,0,0, 1,0,0);

      // Bottom of cube
      n.push(0,-1,0, 0,-1,0, 0,-1,0);
      n.push(0,-1,0, 0,-1,0, 0,-1,0);
      
      this.normals = new Float32Array(n);
    
    }

    checkGLError(tag) {
      const error = gl.getError();
      if (error !== gl.NO_ERROR) {
        console.error('WebGL Error:', error, 'at', tag);
      }
    }
    
    
    render() {
      //if (printCount < 10) console.log(`iteration: ${printCount}`);
      //printCount++;
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;

      if (this.verticies === null) {
        this.generateVerticies();
      }

      if (this.uvs === null) {
        this.generateUvs();
      }

      if (this.normals === null) {
        this.generateNormals();
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

      if(this.normalBuffer === null) {
        this.normalBuffer = gl.createBuffer();

        if (!this.normalBuffer) {
          console.log('Failed to create the buffer object (normals)');
          return -1;
        }
      }
  

      // Pass the texture number
      gl.uniform1i(u_whichTexture, this.textureNum);

      gl.uniform1i(u_isShiny, this.shiny);


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


      // Buffer ops for normals
      
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);

      gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Normal);


      //Draw triangles
      gl.drawArrays(gl.TRIANGLES, 0, this.verticies.length / 3);
      
    }
}