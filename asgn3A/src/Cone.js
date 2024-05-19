// Generated with the help of chatGPT
// https://chat.openai.com/share/cd96b402-da21-4128-aa4c-c8448049daa9
class Cone {
  constructor() {
    this.type = 'Cone';
    this.color = [1.0, 1.0, 1.0, 1.0]; // Default white color
    this.buffer = null;
    this.uvBuffer = null;
    this.vertices = null;
    this.uvs = null;
    this.matrix = new Matrix4();
    this.segments = 20; // Number of slices in the circle base
  }

  generateVertices() {
  let vertices = [];
  let u = [];
  let radius = 1.0;
  let height = 2.0;
  const angleStep = (Math.PI * 2) / this.segments; // Full circle divided by the number of segments

  // Generate the circle vertices on the base
    for (let i = 0; i < this.segments; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;

        // Point on the circle (x, y, z)
        let x1 = radius * Math.cos(angle);
        let y1 = radius * Math.sin(angle);
        let x2 = radius * Math.cos(nextAngle);
        let y2 = radius * Math.sin(nextAngle);

        // Triangle 1: Apex, current point, next point
        vertices.push(0, 0, height); // Apex
        vertices.push(x1, y1, 0); // Current point
        vertices.push(x2, y2, 0); // Next point

        // DUmmy uvs
        u.push(0,1);
        u.push(0,0);
        u.push(1,1);
    }

      this.vertices = new Float32Array(vertices);
      this.uvs = new Float32Array(u)
    }
  

  render() {
    if (this.vertices === null) {
        this.generateVertices();
    }

    if (this.buffer === null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
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

    gl.uniform1i(u_whichTexture, -2);
    // Set the color
    gl.uniform4f(u_FragColor, ...this.color);

    // Pass the transformation matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Bind and fill the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    // Link buffer with the vertex attribute
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Buffer ops for the uvs
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_UV);

    // Draw the cone
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
