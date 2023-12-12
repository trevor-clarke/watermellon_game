let boundaries = [];
let fruit = [];
let arrows = [];
let ghosts = [];
var lastMouse = new Vector(0, 0);
function setup() {
  createCanvas(300, 600);
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

function mouseIsPressed() {
  // fruit.push(FruitFactory.random(mouseX, mouseY));
}

function createBoundaries() {
  a = [
    new Vector(50, 400),
    new Vector(100, 400),
    new Vector(100, 550),
    new Vector(50, 550),
  ].reverse();
  b = [
    new Vector(200, 400),
    new Vector(250, 400),
    new Vector(250, 550),
    new Vector(200, 550),
  ];
  c = [
    new Vector(50, 500),
    new Vector(200, 500),
    new Vector(200, 550),
    new Vector(50, 550),
  ].reverse();
  boundaries.push(new Boundary(...a));
  boundaries.push(new Boundary(...b));
  boundaries.push(new Boundary(...c));
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
