class Fruit extends Entity {
  static G = new Vector(0, 0.5); // Or any value less than the original

  static random(x, y) {
    const type = Fruit.types[Math.floor(Math.random() * Fruit.types.length)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
  }

  update(boundaries, fruit) {
    this.position = this.position.add(this.velocity);

    let startMag = this.velocity.magnitude();

    let onGround = false;
    boundaries.forEach((boundary) => {
      const overlap = calculateOverlap(this.boundingBox, boundary.points);
      if (overlap.magnitude() < 1) return;
      onGround = true;
      this.position = this.position.add(overlap);

      this.velocity = reflect(this.velocity, overlap.normalize());
      this.velocity = this.velocity.multiply(0.6);
    });
    if (!onGround) this.velocity = this.velocity.add(Fruit.G);

    this.velocity = this.velocity.max(this.terminalVelocity);

    // this.velocity = this.velocity.min(0.3);

    this.position = this.position.add(this.velocity);
  }

  draw() {
    fill(this.color);
    noStroke();
  }

  get mass() {
    return this.size;
  }

  get terminalVelocity() {
    this.mass * 10;
  }
}
