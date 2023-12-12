let boundaries = [];
let fruit = [];
let arrows = [];

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
}

function mousePressed() {
  fruit.push(FruitFactory.random(mouseX, mouseY));
}

function createBoundaries() {
  // boundaries.push(
  //   new Boundary(
  //     new Vector(0, height / 2),
  //     new Vector(0, height / 1.5),
  //     new Vector(width / 2, height / 1.5)
  //   )
  // );
  // boundaries.push(
  //   new Boundary(
  //     new Vector(width / 2, height / 1.5),
  //     new Vector(width, height / 1.5),
  //     new Vector(width, height / 2)
  //   )
  // );
  // boundaries.push(
  //   new Boundary(
  //     new Vector(10, 10),
  //     new Vector(width, height / 1.5),
  //     new Vector(width, height / 2)
  //   )
  // );

  // make a straight ground near the bottom
  boundaries.push(
    new Boundary(
      new Vector(0, height),
      new Vector(width, height),
      new Vector(width, height - 10)
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
