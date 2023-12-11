boundaries = [];
fruit = [];
arrows = [];

function setup() {
  createCanvas(600, 600);

  boundaries.push(
    new Boundary(
      new Vector(0, height / 2),
      new Vector(width / 2, height / 1.5),
      new Vector(width / 2, height),
      new Vector(0, height)
    )
  );
  boundaries.push(
    new Boundary(
      new Vector(width - 20, 0),
      new Vector(width - 20, height),
      new Vector(width, height),
      new Vector(width, 0)
    )
  );

  boundaries.push(
    new Boundary(
      new Vector(width / 2 - 20, height / 2 - 20),
      new Vector(width / 2 - 20, height / 2 + 100),
      new Vector(width / 2 + 100, height / 2 + 100),
      new Vector(width / 2 + 100, height / 2 - 20)
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
  });
  console.log(fruit.map((f) => f.velocity.magnitude()));
  arrows.forEach((a) => a.draw());
}

function mousePressed() {
  fruit.push(Fruit.random(mouseX, mouseY));
}
