class Fruit extends Entity {
  static G = new Vector(0, 9.8 / 5 / 2);

  constructor(x, y) {
    super(x, y);
    this.color = "red";
  }

  update(boundaries, fruit) {
    this.wrapAround();
    this.velocity.add_(Fruit.G).max_(this.terminalVelocity);
    this.position = this.position.add(this.velocity);

    const dragForce = this.velocity
      .normalize()
      .negate()
      .multiply(this.size / 110)
      .multiply(0.8);
    this.velocity.add_(dragForce);

    boundaries.forEach((boundary) => {
      const overlap = calculateOverlap(this.boundingBox, boundary.points);
      const overlapMagnitude = overlap.magnitude();
      if (overlapMagnitude > 0) {
        this.position = this.position.subtract(overlap);
        this.velocity = this.velocity.reflect(overlap.normalize());
      }
    });

    fruit.forEach((otherFruit) => {
      if (otherFruit === this) return;
      const overlap = calculateOverlap(
        this.boundingBox,
        otherFruit.boundingBox
      );
      const overlapMagnitude = overlap.magnitude();
      if (overlapMagnitude > 0.1) {
        this.position = this.position.subtract(overlap);
        const { v1, v2 } = perfectlyElasticCollision(
          this.velocity,
          this.mass,
          otherFruit.velocity,
          otherFruit.mass
        );
        this.velocity = v1.multiply(0.999);
        otherFruit.velocity = v2.multiply(0.999);

        this.reduceVelocity(new Vector(0.2, 0.2));
        otherFruit.reduceVelocity(new Vector(0.2, 0.2));
      }
    });
  }

  get points() {
    return this.boundingBox;
  }

  arrow(endpoint, color) {
    return new Arrow(color, this.position, this.position.add(endpoint));
  }

  wrapAround() {
    const p = this.position;
    p.y = p.y > height ? -this.size : p.y;
    p.x = p.x > width ? 0 : p.x < 0 ? width : p.x;
  }

  reduceVelocity(smallAmount) {
    const smallX = smallAmount.x;
    const smallY = smallAmount.y;
    const absVelocityX = Math.abs(this.velocity.x);
    const absVelocityY = Math.abs(this.velocity.y);

    if (absVelocityX < smallX * 3) {
      this.velocity.x = 0;
    }

    if (absVelocityY < smallY * 3) {
      this.velocity.y = 0;
    }
    if (this.velocity.x > 0) {
      this.velocity.x -= smallX;
    } else {
      this.velocity.x += smallX;
    }

    if (this.velocity.y > 0) {
      this.velocity.y -= smallY;
    } else {
      this.velocity.y += smallY;
    }

    if (absVelocityX < smallX * 3) {
      this.velocity.x = 0;
    }

    if (absVelocityY < smallY * 3) {
      this.velocity.y = 0;
    }
  }

  get mass() {
    return (this.size * this.size * this.size) / 100;
  }
  get terminalVelocity() {
    return 40;
  }
}

function perfectlyElasticCollision(v1, m1, v2, m2) {
  const v1f = v1
    .multiply(m1 - m2)
    .add(v2.multiply(2 * m2))
    .divide(m1 + m2);

  const v2f = v2
    .multiply(m2 - m1)
    .add(v1.multiply(2 * m1))
    .divide(m1 + m2);

  return { v1: v1f, v2: v2f };
}
