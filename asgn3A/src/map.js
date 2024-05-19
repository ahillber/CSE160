function groundSky() {
    let floor = new Cube();
    floor.color = [143/255, 247/255, 154/255, 1.0];
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
    let box1 = new Cube();
    box1.textureNum = 1;
    box1.matrix.translate(1, -0.8, -0.5);
    box1.render();


    let box2 = new Cube();
    box2.textureNum = 2;
    box2.matrix.translate(-2, -0.8, -0.5);
    box2.render();

    let box3 = new Cube();
    box3.color = [0.75, 0.6, 0.76, 1];
    box3.matrix = new Matrix4(box2.matrix);
    box3.matrix.translate(0.5, 1, 0);
    box3.matrix.scale(0.5, 0.5, 0.5);
    box3.render();

}