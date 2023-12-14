let boundaries = [];
let fruit = [];
let arrows = [];
var lastMouse = new Vector(0, 0);
let clickedFruit = [];
let mouseForceRadius = 100;

function preload() {
  document.oncontextmenu = function () {
    return false;
  };
}
function setup() {
  c = createCanvas(600, 500);
  c.mouseReleased(mouseReleased);

  createBoundaries();

  for (var i = 0; i < 5; i++)
    fruit.push(
      FruitFactory.create(random(0, width), random(0, height), Orange)
    );
  // fruit.push(FruitFactory.create(100, 100, Watermelon));
  // for (var i = 0; i < 6; i++) fruit.push(FruitFactory.create(100, 100, Apple));

  // frameRate(60);
}

let loopDurations = [];
let start_time, end_time;

function draw() {
  start_time = performance.now();
  background(250);
  allowSelectingTheClosestFruit();

  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
  });
  boundaries.forEach((b) => b.draw());

  arrows.forEach((a) => a.draw());
  trackMouseLocation();
  loopDurations.push(performance.now() - start_time);
  textAlign(LEFT);
  const renderTime = (
    loopDurations.reduce((acc, d) => acc + d, 0) / loopDurations.length
  ).toFixed(4);

  displayInfo(
    ["fps", frameRate().toFixed(2)],
    ["render time", renderTime],
    ["fruit", fruit.length],
    ["bounds", boundaries.length],
    ["arrows", arrows.length]
  );
}

function keyPressed() {
  if (keyCode === 32) {
    fruit.forEach((f) => {
      f.velocity = new Vector(0, 0);
      f.position = new Vector(random(0, width), random(0, height));
    });
  }
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

  //big ass ramp:

  // boundaries.push(
  //   new Boundary(
  //     new Vector(0, 100),
  //     new Vector((width / 3) * 2, height),
  //     new Vector(0, height)
  //   )
  // );
  // // smaller ass ramp on right side

  // boundaries.push(
  //   new Boundary(
  //     new Vector(width, 150),
  //     new Vector(width, 300),
  //     new Vector(width - 150, 300)
  //   )
  // );

  // for (var i = 0; i < 5; i++)
  //   boundaries.push(
  //     new Boundary(
  //       ...Polygon.generateCircle(
  //         random(0, width),
  //         random(0, height),
  //         random(20, 30),
  //         6
  //       )
  //     )
  //   );
}

function mouseReleased() {
  console.log("released");

  if (mouseButton == LEFT) {
    clickedFruit = [];
  }
}
function mousePressed() {
  if (mouseButton == RIGHT && frameRate() > 40) {
    fruit.push(FruitFactory.random(mouseX, mouseY));
    fruit[fruit.length - 1].velocity = mouseVelocity();
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

function findClosesFruit(x, y) {
  const closestFruit = fruit.reduce(
    (acc, f) => {
      const distance = f.position.distance(new Vector(x, y));
      if (distance < acc.distance) {
        return { distance, fruit: f };
      }
      return acc;
    },
    { distance: Infinity, fruit: null }
  ).fruit;

  return closestFruit;
}

findFruitWithinRadius = (x, y, radius) => {
  return fruit.filter((f) => {
    const distance = f.position.distance(new Vector(x, y));
    return distance < radius;
  });
};

function displayInfo(...items) {
  const w = width;
  const t = w - 55;
  const e = t / items.length;
  const a = min(e, 70);
  fill(50);
  //items are an array including a title and value
  items.forEach((item, i) => {
    textSize(12);

    text(item[1], a * i + 10, 15);
    textSize(10);
    text(item[0], a * i + 10, 25);
  });
}
