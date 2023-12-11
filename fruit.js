class Fruit extends Entity {
  static G = new Vector(0, 3 / 10);
  static damping = 0.99;
  static restitution = 0.8;

  static random(x, y) {
    const type = Fruit.types[Math.floor(Math.random() * Fruit.types.length)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
  }

  update(entities) {
    this.velocity = this.velocity.add(Fruit.G).multiply(Fruit.damping);

    let newPos = this.position.add(this.velocity);

    for (let entity of entities) {
      if (entity === this) continue;

      if (polygonsCollide(this.boundingBox, entity.boundingBox)) {
        let overlap = calculateOverlap(this.boundingBox, entity.boundingBox);
        newPos = newPos.subtract(overlap);

        let normal = overlap.normalize();
        let reflection = reflect(this.velocity, normal, this.mass, entity.mass);
        // clamp x and y between -10 and 10
        reflection.x = Math.max(-10, Math.min(10, reflection.x));
        reflection.y = Math.max(-10, Math.min(10, reflection.y));

        this.velocity = reflection.multiply(Fruit.restitution);

        this.velocity = this.velocity = this.velocity.multiply(0.3);
      }
    }

    this.position = newPos;
  }

  updateVelocity(delta) {
    this.velocity = this.velocity.add(delta);
  }

  updatePosition() {
    this.position = this.position.add(this.velocity.dup);
  }

  draw() {
    fill(this.color);
    noStroke();
  }

  get mass() {
    return this.size * this.size * this.size;
  }
}

class Apple extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "red";
    this.size = 20;
  }

  draw() {
    super.draw();
    ellipse(this.position.x, this.position.y, this.size * 2); // Use this.size * 2
  }

  get boundingBox() {
    return getCircularBoundingBox(this.position.x, this.position.y, this.size);
  }
}

class Orange extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "orange";
    this.size = 30;
  }

  draw() {
    super.draw();
    ellipse(this.position.x, this.position.y, this.size * 2); // Use this.size * 2
  }

  get boundingBox() {
    return getCircularBoundingBox(this.position.x, this.position.y, this.size);
  }
}

class Blueberry extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "blue";
    this.size = 40;
    this.shape = "square";
  }

  draw() {
    super.draw();
    rectMode(CENTER);
    rect(this.position.x, this.position.y, this.size, this.size);
  }

  get boundingBox() {
    return getRectangularBoundingBox(
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }
}

function getRectangularBoundingBox(centerX, centerY, width, height) {
  return [
    {
      x: centerX - width / 2,
      y: centerY - height / 2,
    },
    {
      x: centerX + width / 2,
      y: centerY - height / 2,
    },
    {
      x: centerX + width / 2,
      y: centerY + height / 2,
    },
    {
      x: centerX - width / 2,
      y: centerY + height / 2,
    },
  ];
}
function getCircularBoundingBox(centerX, centerY, radius) {
  // approximate circle with many points

  let boundingBox = [];
  let angle = 0;
  let angleIncrement = (Math.PI * 2) / 5;
  while (angle < Math.PI * 2) {
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    boundingBox.push({ x, y });
    angle += angleIncrement;
  }
  return boundingBox;
}

Fruit.types = [Blueberry, Apple, Orange];
