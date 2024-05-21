// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
    let x = Math.random() * (max - min) + min;
    let z = Math.floor(x);
    return z;
}
//console.log(getRandomArbitrary(0, 31));

function placeRandom() {
    while (true) {
        let x = getRandomArbitrary(0, 31);
        let y = getRandomArbitrary(0, 31);

        if (g_map[0][x][y] > 0){
            continue;
        } else {
            console.log('here');
            g_map[0][x][y] = 5;
            break;
        }
    }
}


function groundSky() {
    let floor = new Cube();
    floor.color = [82/255, 191/255, 115/255, 1.0];
    //floor.textureNum = 1;
    floor.matrix.translate(0, -0.8, 0);
    floor.matrix.scale(50, 0, 50);
    floor.matrix.translate(-0.5, 0, -0.5);
    floor.render();

    let sky = new Cube();
    sky.textureNum = 0;
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.render();
}

function buildMap() {
    
}

let g_map = []; 
function initMap() {
    for (let z=0; z<5; z++) {
        let tempZ = [];
        for (let x=0;x<32;x++) {
            let temp = [];
            for (let y=0;y<32;y++) {
                temp.push(0);
            }
            tempZ.push(temp);
        }
        g_map.push(tempZ);
    }
}
initMap();
let updateRender = [];

function generateWalls() {
    for (let z=0; z<5; z++) {
        for(let x=0; x<32; x++) {
            for(let y=0; y<32; y++) {
                if (x == 0 || x == 31 || y == 0 || y == 31) {
                    g_map[z][x][y] = 1;
                  }
            }
        }
    }
}
generateWalls();

function renderTree(posX, posY) {
    // Tree Trunk
    for (let z=0; z<=3; z++) {
        if (z === 2){
            g_map[z][posX][posY] = 3;
            g_map[z][posX][posY-1] = 3;
            g_map[z][posX+1][posY+1] = 3;
            g_map[z][posX+1][posY-1] = 3;
            g_map[z][posX-1][posY-1] = 3;
            g_map[z][posX-1][posY] = 3;
            g_map[z][posX-1][posY+1] = 3;
        } else if (z === 3) {
            g_map[z][posX][posY] = 3;
            g_map[z][posX-1][posY] = 3;
            g_map[z][posX+1][posY] = 3;
        } else {
            g_map[z][posX][posY] = 2;
        }
    }
}
renderTree(25, 25);
renderTree(20, 20);
renderTree(5,5);
renderTree(2, 28);
renderTree(13, 19);
renderTree(29, 4);

placeRandom();

function renderBush(posX, posY) {
    g_map[0][posX][posY] = 3;
    g_map[0][posX+1][posY] = 3;
    g_map[0][posX][posY+1] = 3;
    g_map[0][posX+1][posY+1] = 3;
}

renderBush(20, 8);
renderBush(28, 14);

function renderCrates(posX, posY) {
    g_map[0][posX][posY] = 4;
}

renderCrates(4,20);
renderCrates(16, 30);
renderCrates(18, 30);
renderCrates(15, 30);

renderCrates(15, 5);
renderCrates(20, 7);
renderCrates(23, 10);
renderCrates(8, 7);
renderCrates(4, 18);
renderCrates(9, 8);

function drawMap() {
    for (let z=0; z<5; z++) {
        for (let x=0;x<32;x++) {
            for (let y=0;y<32;y++) {
                // Texture based off of number in g_map
                if (g_map[z][x][y] === 1) {
                    let body = new Cube();
                    body.matrix.translate(0,-.75,0);
                    body.textureNum = 1;
                    //body.matrix.scale(.3,.3,.3);
                    body.matrix.translate(x-16, z, y-16);
                    body.render();
                } else if (g_map[z][x][y] === 2) {
                    let body = new Cube();
                    body.matrix.translate(0,-.75,0);
                    body.textureNum = 2;
                    //body.matrix.scale(.3,.3,.3);
                    body.matrix.translate(x-16, z, y-16);
                    body.render();
                } else if (g_map[z][x][y] === 3) {
                    let body = new Cube();
                    body.matrix.translate(0,-.75,0);
                    body.textureNum = 3;
                    //body.matrix.scale(.3,.3,.3);
                    body.matrix.translate(x-16, z, y-16);
                    body.render();
                } else if (g_map[z][x][y] === 4) {
                    let body = new Cube();
                    body.matrix.translate(0,-.75,0);
                    body.textureNum = 4;
                    //body.matrix.scale(.3,.3,.3);
                    body.matrix.translate(x-16, z, y-16);
                    body.render();
                } else if (g_map[z][x][y] === 5) {
                    let body = new Cube();
                    body.matrix.translate(0,-.75,0);
                    body.textureNum = 5;
                    //body.matrix.scale(.3,.3,.3);
                    body.matrix.translate(x-16, z, y-16);
                    body.render();
                }
            }
        }
    }
}
