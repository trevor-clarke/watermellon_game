boundaries = [];
fruit = [];
arrows = [];

function addArrow(color, location, vector) {
  arrows.push([color, location, vector]);
}

function drawArrow(color, location, vector) {
  // draw a line and a triangle to represent a vector
  push();
  strokeWeight(1);
  stroke(color);
  fill(color);
  line(location.x, location.y, vector.x, vector.y);
  translate(vector.x, vector.y);
  circle(0, 0, 5);
  pop();
}

function setup() {
  createCanvas(600, 600);

  let left = new Boundary(
    new Vector(0, height / 2),
    new Vector(width / 2, height / 1.5),
    new Vector(width / 2, height),
    new Vector(0, height)
  );

  boundaries.push(left);

  fruit.push(new Apple(100, 100));
}

function draw() {
  background(230);

  boundaries.forEach((b) => b.draw());
  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
  });
  arrows.forEach((a) => drawArrow(a[0], a[1], a[2]));
}

function mousePressed() {
  fruit.push(Fruit.random(mouseX, mouseY));
}
