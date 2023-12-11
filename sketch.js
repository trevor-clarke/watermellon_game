entities = [];

function setup() {
  createCanvas(600, 600);

  entities.push(new Boundary(width / 2, height, width, 50));
  entities.push(new Boundary(0, height / 2, 50, height));
  entities.push(new Boundary(width, height / 2, 50, height));
}

function draw() {
  background(220);

  entities.forEach((entity) => {
    entity.update(entities);
    entity.draw();
  });
}

function mousePressed() {
  entities.push(Fruit.random(mouseX, mouseY));
}

class Boundary extends Entity {
  //defined at its center point
  constructor(x, y, width, height) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  draw() {
    fill(0);
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.width, this.height);
  }

  get boundingBox() {
    return getRectangularBoundingBox(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  get mass() {
    return 9999999999;
  }

  update() {}
}
