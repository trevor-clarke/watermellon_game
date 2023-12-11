class Fruit {
  static FRUIT_TYPES = {
    0: {
      color: "red",
      size: 10,
      bounceFactor: 0.8,
    },
    1: {
      color: "orange",
      size: 15,
      bounceFactor: 0.8,
    },
    // Add additional fruit types here if needed
  };

  static g = new Vector(0, 9.8 / 1000);

  constructor(x, y, type) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
    this.type = type;
    this.size = Fruit.FRUIT_TYPES[this.type].size;
    this.mass = this.size * this.size;
    this.floorY = height - this.size;
  }

  update(others) {
    let v = this.velocity.dup;

    // v.add(Fruit.g.multiply(this.mass));

    this.velocity = v;
    this.position.add(this.velocity);
    return;

    // += Fruit.GRAVITY * this.mass; // Gravity scaled by mass

    this.x += this.velocityX;
    this.y += this.velocityY;

    // Floor collision
    if (this.y > this.floorY) {
      this.y = this.floorY;
      this.velocityY *= -Fruit.FRUIT_TYPES[this.type].bounceFactor;
    }

    // Side walls collision
    if (this.x - this.size < 0 || this.x + this.size > width) {
      this.velocityX *= -Fruit.FRUIT_TYPES[this.type].bounceFactor;
      if (this.x - this.size < 0) {
        this.x = this.size;
      } else if (this.x + this.size > width) {
        this.x = width - this.size;
      }
    }

    // Friction
    this.velocityX *= 0.95; // Applying horizontal friction
    this.velocityY *= 0.95; // Applying vertical friction
  }

  draw() {
    fill(Fruit.FRUIT_TYPES[this.type].color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size * 2);
  }

  checkCollisions(others) {
    for (let other of others) {
      if (other !== this && this.intersects(other)) {
        this.resolveCollision(other);
      }
    }
  }

  intersects(other) {
    const distance = dist(this.x, this.y, other.x, other.y);
    const combinedSize = this.size + other.size;
    return distance < combinedSize;
  }

  resolveCollision(other) {
    // Basic collision resolution adjusted for mass
    // This can be further refined for more realistic physics
    const combinedMass = this.mass + other.mass;
    const massRatio = this.mass / combinedMass;

    // Calculate the overlap and adjust positions
    const overlap =
      this.size + other.size - dist(this.x, this.y, other.x, other.y);
    const angle = atan2(this.y - other.y, this.x - other.x);
    this.x += cos(angle) * overlap * (1 - massRatio);
    this.y += sin(angle) * overlap * (1 - massRatio);

    // Basic velocity exchange adjusted for mass
    let tempVelX = this.velocityX * massRatio;
    let tempVelY = this.velocityY * massRatio;
    this.velocityX = other.velocityX * (1 - massRatio);
    this.velocityY = other.velocityY * (1 - massRatio);
    other.velocityX = tempVelX;
    other.velocityY = tempVelY;
  }
}
