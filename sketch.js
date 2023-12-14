let boundaries = [];
let fruit = [];
let arrows = [];
var lastMouse = new Vector(0, 0);
function setup() {
  createCanvas(600, 600);
  createBoundaries();
  fruit.push(FruitFactory.create(100, 100, Watermelon));
}

function draw() {
  background(250);
  boundaries.forEach((b) => b.draw());
  updateAndDrawFruits();
  arrows.forEach((a) => a.draw());
  allowSelectingTheClosestFruit();
  trackMouseLocation();
  displayFps();
}

function createBoundaries() {
  boundaries.push(
    new Boundary(
      ...[
        new Vector(0, 400),
        new Vector(50, 400),
        new Vector(250, 550),
        new Vector(0, 550),
      ].reverse()
    )
  );
  //reflection of above
  boundaries.push(
    new Boundary(
      ...[
        new Vector(600, 400),
        new Vector(550, 400),
        new Vector(350, 550),
        new Vector(600, 550),
      ].reverse()
    )
  );

  boundaries.push(
    new Boundary(...getCircularBoundingBox(width / 2, 200, 50, 6))
  );
}

function mousePressed() {
  if (mouseButton !== RIGHT) return;
  if (frameRate() < 40) return;
  fruit.push(FruitFactory.random(mouseX, mouseY));
  fruit[fruit.length - 1].velocity = mouseVelocity();
}

function updateAndDrawFruits() {
  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
  });
}

function displayFps() {
  fill(0);
  textSize(11);
  text(frameRate().toFixed(0), 10, 20);
}

function trackMouseLocation() {
  lastMouse = new Vector(mouseX, mouseY);
}

function mouseVelocity() {
  return new Vector(mouseX, mouseY).subtract(lastMouse);
}

function allowSelectingTheClosestFruit() {
  if (mouseIsPressed) {
    // find the closest fruit
    const closestFruit = fruit.reduce(
      (acc, f) => {
        const distance = f.position.distance(new Vector(mouseX, mouseY));
        if (distance < acc.distance) {
          return { distance, fruit: f };
        }
        return acc;
      },
      { distance: Infinity, fruit: null }
    ).fruit;

    closestFruit.position = new Vector(mouseX, mouseY);
    closestFruit.velocity = mouseVelocity().divide(2);
  }
}
