// DrawRectangle.js
function main() {
    // Retrieve <canvas> element <- (1)
    let canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    let ctx = canvas.getContext('2d');
    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set black canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
    
    let v1 = new Vector3([2.25, 2.25, 0]);
    drawVector(v1, 'red');
} 

function drawVector(vector, color) {
    let canvas = document.getElementById('example');
    let ctx = canvas.getContext('2d');
    
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    let coords = vector.elements;

    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (coords[0] * 20), cy - (coords[1] * 20));
    ctx.stroke();
}

function handleDrawEvent() {
    let canvas = document.getElementById('example');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set black canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

    let v1x = document.getElementById('v1').value;
    let v1y = document.getElementById('v1y').value;

    let v2x = document.getElementById('v2x').value;
    let v2y = document.getElementById('v2y').value;

    let v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, 'red');

    let v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, 'blue');
}

function handleDrawOperationEvent() {
    let operation = document.getElementById('ops-select').value;

    let canvas = document.getElementById('example');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set black canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let v1x = document.getElementById('v1').value;
    let v1y = document.getElementById('v1y').value;

    let v2x = document.getElementById('v2x').value;
    let v2y = document.getElementById('v2y').value;

    let scal = document.getElementById('scalar').value;

    let v1 = new Vector3([v1x, v1y, 0]);
    drawVector(v1, 'red');

    let v2 = new Vector3([v2x, v2y, 0]);
    drawVector(v2, 'blue');

    if (operation === 'Add') {
        v1.add(v2);
        drawVector(v1, 'green');
    }
    else if (operation === 'Sub') {
        v1.sub(v2);
        drawVector(v1, 'green');
    }
    else if (operation === 'Multiply'){
        v1.mul(scal);
        v2.mul(scal);

        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }
    else if (operation === 'Divide'){
        v1.div(scal);
        v2.div(scal);

        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }
    else if (operation === 'Magnitude'){
        let mag = v1.magnitude();
        console.log(`Magnitude v1: ${mag}`);

        let mag2 = v2.magnitude();
        console.log(`Magnitude v2: ${mag2}`);
    }
    else if(operation ==='Normalize'){
        v1.normalize();
        v2.normalize();

        drawVector(v1, 'green');
        drawVector(v2, 'green');
    }
    else if(operation === 'Angle'){
        angleBetween(v1, v2);
    }
    else if(operation === 'Area'){
        areaTriangle(v1, v2);
    }
}

function angleBetween(v1, v2) {
    let dotProduct = Vector3.dot(v1, v2);
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();
    

    let result = dotProduct / (mag1 * mag2);
    result = Math.acos(result);
    result = result * (180/Math.PI);
    console.log(`Angle: ${result}`);
}

function areaTriangle(v1, v2) {
    let v3 = Vector3.cross(v1, v2);
    let mag = v3.magnitude();
    let result = mag / 2;
    console.log(`Area of the triangle: ${result}`);
}