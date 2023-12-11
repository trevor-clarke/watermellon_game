class Fruit extends Entity {
  static G = new Vector(0, 5 / 10); // Or any value less than the original

  static random(x, y) {
    const type = Fruit.types[Math.floor(Math.random() * Fruit.types.length)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
  }

  // const velocityAlongNormal = this.velocity.dot(normal);
  // if (velocityAlongNormal > 0) return;

  // const restitution = Fruit.restitution;
  // const impulseScalar =
  //   (-(1 + restitution) * velocityAlongNormal) / this.mass;
  // const impulse = normal.multiply(impulseScalar);

  // this.velocity = this.velocity.add(impulse);
  // this.velocity = this.velocity.multiply(1 - Fruit.damping);

  update(boundaries, fruit) {
    // addArrow("blue", this.position, this.position);
    // addArrow("green", this.position, this.position.add(this.velocity));

    this.velocity = this.velocity.add(Fruit.G);
    this.position = this.position.add(this.velocity);

    boundaries.forEach((boundary) => {
      const overlap = calculateOverlap(this.boundingBox, boundary.points);
      if (overlap.magnitude() < 1) return;
      this.position = this.position.subtract(overlap);

      const normal = overlap.normalize();
      addArrow("red", this.position, this.position.add(normal.multiply(10)));

      // we must "bounce" the fruit off the boundary
      const reflected = reflect(this.velocity, normal);
      this.velocity = reflected.multiply(0.9);
    });
  }

  draw() {
    fill(this.color);
    noStroke();
  }

  get mass() {
    return this.size;
  }

  get terminalVelocity() {
    return 7;
  }
}
