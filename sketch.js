objects = [];
var lastMouse = new Vector(0, 0);
let clickedFruit = [];
let frameRates = [];
let renderTimes = [];
let mouseForceRadius = 100;
let start_time = performance.now();

function preload() {
  document.oncontextmenu = function () {
    return false;
  };
}
function setup() {
  c = createCanvas(600, 500);
  c.mouseReleased(mouseReleased);

  createBoundaries();

  for (var i = 0; i < 3; i++) {
    objects.push(
      FruitFactory.create(random(150, width - 250), random(-150, 0), Apple)
    );
    objects.push(
      FruitFactory.create(random(150, width - 250), random(-150, 0), Orange)
    );
    objects.push(
      FruitFactory.create(random(150, width - 250), random(-150, 0), Watermelon)
    );
  }

  // startTest();
}

function draw() {
  start_time = performance.now();
  background(250);
  allowSelectingTheClosestFruit();

  objects.forEach((f) => {
    f.draw();
    f.update(objects);
  });

  trackMouseLocation();

  textAlign(LEFT);

  renderTime = claculatePerformance();

  displayInfo(
    ["fps", frameRate().toFixed(2)],
    ["render time", renderTime],
    ["objects", objects.length]
  );

  frameRates.push(frameRate());
  renderTimes.push(int(renderTime));
}

function claculatePerformance() {
  return (performance.now() - start_time).toFixed(4);
}

function keyPressed() {
  if (keyCode === 32) {
    object.forEach((f) => {
      if (!(f instanceof Fruit)) return;
      f.velocity = new Vector(0, 0);
      f.position = new Vector(random(0, width), random(0, height));
    });
  }
}

function createBoundaries() {
  objects.push(
    new Boundary(
      new Vector(100, 200),
      new Vector(100, 400),
      new Vector(70, 400),
      new Vector(70, 200)
    )
  );

  objects.push(
    new Boundary(
      new Vector(400, 200),
      new Vector(400, 400),
      new Vector(430, 400),
      new Vector(430, 200)
    )
  );

  objects.push(
    new Boundary(
      new Vector(70, 400),
      new Vector(70, 430),
      new Vector(430, 430),
      new Vector(430, 400)
    )
  );
}

function mouseReleased() {
  console.log("released");

  if (mouseButton == LEFT) {
    clickedFruit = [];
  }
}
function mousePressed() {
  if (mouseButton == RIGHT && frameRate() > 40) {
    objects.push(FruitFactory.random(mouseX, mouseY));
    objects[objects.length - 1].velocity = mouseVelocity();
  }

  if (mouseButton == LEFT) {
    clickedFruit = findFruitWithinRadius(mouseX, mouseY, mouseForceRadius);
  }
  return false;
}

function trackMouseLocation() {
  lastMouse = new Vector(mouseX, mouseY);
}

function mouseVelocity() {
  return new Vector(mouseX, mouseY).subtract(lastMouse);
}

function allowSelectingTheClosestFruit() {
  push();
  noFill();
  stroke(50, 50, 50, 50);
  circle(mouseX, mouseY, mouseForceRadius * 2);
  pop();
  if (mouseIsPressed) {
    if (!clickedFruit) return;
    const mouse = new Vector(mouseX, mouseY);

    for (let f of clickedFruit) {
      const distanceToMouse = f.position.distance(mouse);
      const normalToMouse = mouse.subtract(f.position).normalize();
      const toMouse = normalToMouse.multiply(distanceToMouse * 0.01);
      // scale the force by the distance to the mouse so the force is 0 when the mouse is far away

      f.externalForce.push(toMouse);
    }
  }
}

findFruitWithinRadius = (x, y, radius) => {
  return objects.filter((f) => {
    if (!(f instanceof Fruit)) return false;
    const distance = f.position.distance(new Vector(x, y));
    return distance < radius;
  });
};

function displayInfo(...items) {
  const e = (width - 55) / items.length;
  const a = min(e, 70);
  push();
  fill(50);

  items.forEach((item, i) => {
    textSize(12);
    text(item[1], a * i + 10, 15);
    textSize(10);
    text(item[0], a * i + 10, 25);
  });
  pop();
}
