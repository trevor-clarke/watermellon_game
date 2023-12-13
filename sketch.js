let boundaries = [];
let fruit = [];
let arrows = [];
let ghosts = [];
var lastMouse = new Vector(0, 0);
function setup() {
  createCanvas(500, 600);
  createBoundaries();
  fruit.push(FruitFactory.random(150, 100));
}

function draw() {
  background(250);
  drawBoundaries();
  updateAndDrawFruits();
  arrows.forEach((a) => a.draw());
  if (mouseIsPressed) {
    mouseVelocity = new Vector(mouseX, mouseY).subtract(lastMouse);
    fruit[0].position = new Vector(mouseX, mouseY);
    fruit[0].velocity = mouseVelocity.divide(2);
  }
  ghosts.forEach((g) => g.draw());
  lastMouse = new Vector(mouseX, mouseY);
}

// function mousePressed() {
//   fruit.push(FruitFactory.random(mouseX, mouseY));
//   fruit[fruit.length - 1].velocity = mouseVelocity;
// }

function createBoundaries() {
  boundaries.push(
    new Boundary(
      0.3,
      new Vector(100, 400),
      new Vector(150, 400),
      new Vector(350, 550),
      new Vector(100, 550)
    )
  );
  boundaries.push(
    //floor
    new Boundary(
      0.4,
      new Vector(0, 550),
      new Vector(width, 550),
      new Vector(width, height),
      new Vector(0, height)
    )
  );
}

function drawBoundaries() {
  boundaries.forEach((b) => b.draw());
}

function updateAndDrawFruits() {
  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
  });
}
