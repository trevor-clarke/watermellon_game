boundaries = [];
fruit = [];
arrows = [];

function setup() {
  createCanvas(300, 600);

  boundaries.push(
    new Boundary(
      new Vector(0, height / 2), // Top-left corner
      new Vector(0, height / 1.5), // Bottom-left corner
      new Vector(width / 2, height / 1.5) // Top-right corner (or mid-right, depending on your shape)
    )
  );
  //define a triangle mirrored to it
  boundaries.push(
    new Boundary(
      new Vector(width / 2, height / 1.5), // Top-left corner (or mid-left, depending on your shape)
      new Vector(width, height / 1.5), // Bottom-right corner

      new Vector(width, height / 2) // Top-right corner
    )
  );

  fruit.push(new Apple(100, 100));
}

function draw() {
  background(250);

  boundaries.forEach((b) => b.draw());
  fruit.forEach((f) => {
    f.draw();
    f.update(boundaries, fruit);
    // anything that goes off the bottom, put to the top,
    // anything that goes off the sizes, wrap around
    if (f.position.y > height) {
      f.position.y = -f.size;
    }
    if (f.position.x > width) {
      f.position.x = 0;
    }
    if (f.position.x < 0) {
      f.position.x = width;
    }
  });
  arrows.forEach((a) => a.draw());
}

function mousePressed() {
  fruit.push(Fruit.random(mouseX, mouseY));
}
