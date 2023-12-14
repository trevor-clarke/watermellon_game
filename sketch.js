let boundaries = [];
let fruit = [];
let arrows = [];
var lastMouse = new Vector(0, 0);

function setup() {
  createCanvas(600, 500);
  createBoundaries();

  for (var i = 0; i < 50; i++)
    fruit.push(
      FruitFactory.create(random(0, width), random(0, height), Orange)
    );
  // fruit.push(FruitFactory.create(100, 100, Watermelon));
  frameRate(60);
}

let loopDurations = [];
let start_time, end_time;

function draw() {
  start_time = performance.now();
  background(250);
  boundaries.forEach((b) => b.draw());
  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
  });
  arrows.forEach((a) => a.draw());
  allowSelectingTheClosestFruit();
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

function createBoundaries() {
  // boundaries.push(
  //   new Boundary(
  //     new Vector(100, 200),
  //     new Vector(100, 400),
  //     new Vector(70, 400),
  //     new Vector(70, 200)
  //   )
  // );

  // boundaries.push(
  //   new Boundary(
  //     new Vector(400, 200),
  //     new Vector(400, 400),
  //     new Vector(430, 400),
  //     new Vector(430, 200)
  //   )
  // );

  // boundaries.push(
  //   new Boundary(
  //     new Vector(70, 400),
  //     new Vector(70, 430),
  //     new Vector(430, 430),
  //     new Vector(430, 400)
  //   )
  // );

  //big ass ramp:

  boundaries.push(
    new Boundary(
      new Vector(0, 100),
      new Vector((width / 3) * 2, height),
      new Vector(0, height)
    )
  );
  // smaller ass ramp on right side

  boundaries.push(
    new Boundary(
      new Vector(width, 150),
      new Vector(width, 300),
      new Vector(width - 150, 300)
    )
  );

  for (var i = 0; i < 5; i++)
    boundaries.push(
      new Boundary(
        ...Polygon.generateCircle(
          random(0, width),
          random(0, height),
          random(20, 30),
          6
        )
      )
    );
}

function mousePressed() {
  if (mouseButton !== RIGHT) return;
  if (frameRate() < 40) return;
  fruit.push(FruitFactory.random(mouseX, mouseY));
  fruit[fruit.length - 1].velocity = mouseVelocity();
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
