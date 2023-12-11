class Fruit extends Entity {
  static G = new Vector(0, 1.1); // Or any value less than the original

  static random(x, y) {
    const type = Fruit.types[Math.floor(Math.random() * Fruit.types.length)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
  }

  update(boundaries, fruit) {
    this.velocity = this.velocity.add(Fruit.G);

    boundaries.forEach((boundary) => {
      const overlap = calculateOverlap(this.boundingBox, boundary.points);
      if (overlap.magnitude() < 1) return;
      this.position = this.position.subtract(overlap);
      const normal = overlap.normalize();

      this.velocity = reflect(this.velocity, normal).multiply(0.9);
      arrows.push(
        new Arrow("red", this.position, this.position.add(normal.multiply(10)))
      );
    });

    this.velocity = this.velocity.min(1).max(this.terminalVelocity);
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
