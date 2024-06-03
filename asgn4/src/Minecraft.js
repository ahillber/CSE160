function deleteBlock() {
  let locationX = Math.floor(camera.at.elements[0]) + 16;
  let locationY = Math.floor(camera.at.elements[2]) + 16;
  //console.log(`x: ${locationX} y: ${locationY}`);
  if (g_map[0][locationX][locationY] >= 1) {
    //console.log(g_map[locationX][locationY]);
    if (g_map[0][locationX][locationY] === 5) {
      alert('You won!');
    }
    g_map[0][locationX][locationY] = 0;
  }
}

function addBlock() {
  let locationX = Math.floor(camera.at.elements[0]) + 16;
  let locationY = Math.floor(camera.at.elements[2]) + 16;
  //console.log(locationX, locationY);
  //console.log(camera.at.elements);

  if (g_map[0][locationX][locationY] === 0) {
    //console.log(g_map[locationX][locationY]);
    g_map[0][locationX][locationY] = g_placeBlock;
  }
}