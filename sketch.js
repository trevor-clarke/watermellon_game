let boundaries = [];
let fruit = [];
let arrows = [];
var lastMouse = new Vector(0, 0);

function setup() {
  createCanvas(600, 600);
  createBoundaries();
  fruit.push(FruitFactory.create(100, 100, Watermelon));
  frameRate(60);
}

function draw() {
  background(250);
  boundaries.forEach((b) => b.draw());
  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
  });
  arrows.forEach((a) => a.draw());
  allowSelectingTheClosestFruit();
  trackMouseLocation();
  displayFps();
}

function createBoundaries() {
  boundaries.push(
    new Boundary(
      new Vector(100, 200),
      new Vector(100, 400),
      new Vector(70, 400),
      new Vector(70, 200)
    )
  );

  boundaries.push(
    new Boundary(
      new Vector(400, 200),
      new Vector(400, 400),
      new Vector(430, 400),
      new Vector(430, 200)
    )
  );

  boundaries.push(
    new Boundary(
      new Vector(70, 400),
      new Vector(70, 430),
      new Vector(430, 430),
      new Vector(430, 400)
    )
  );
}

function mousePressed() {
  if (mouseButton !== RIGHT) return;
  if (frameRate() < 40) return;
  fruit.push(FruitFactory.random(mouseX, mouseY));
  fruit[fruit.length - 1].velocity = mouseVelocity();
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
