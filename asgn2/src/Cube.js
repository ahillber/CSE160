class Cube {
    constructor() {
      this.type = 'Cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      //this.segments = 10;
      this.buffer = null;
      this.verticies = null;
      this.matrix = new Matrix4();
    }

    generateVerticies() {
      let v = [];

      v.push(0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0);
      v.push(0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0);

      v.push(1.0,1.0,0.0, 1.0,1.0,1.0, 0.0,1.0,0.0);
      v.push(0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0);

      v.push (0.0,1.0,1.0, 1.0,1.0,1.0, 0.0,0.0,1.0);
      v.push(1.0,1.0,1.0, 1.0,0.0,1.0, 0.0,0.0,1.0);

      // Side of cube
      v.push(0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,0.0,1.0);
      v.push(0.0,1.0,1.0, 0.0,1.0,0.0, 0.0,0.0,1.0);

      v.push(1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,1.0);
      v.push(1.0,1.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0);

      // Bottom of cube
      v.push(0.0,0.0,0.0, 1.0,0.0,0.0, 0.0,0.0,1.0);
      v.push(1.0,0.0,0.0, 1.0,0.0,1.0, 0.0,0.0,1.0);

      this.verticies = new Float32Array(v);
    }
    
    render() {
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;

      if (this.verticies === null) {
        this.generateVerticies();
      }

      if(this.buffer === null) {
        this.buffer = gl.createBuffer();

        if(!this.buffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }
      }

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

      gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_Position);
      gl.drawArrays(gl.TRIANGLES, 0, this.verticies.length / 3);
    }
}