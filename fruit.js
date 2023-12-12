class Fruit extends Entity {
  static G = new Vector(0, 0.5);

  constructor(x, y) {
    super(x, y);
    this.color = "red";
  }

  update(boundaries, fruit) {
    this.position = this.position.add(this.velocity);
    this.wrapAround();

    let { hit, overlap } = this.boundaryOverlap(boundaries);

    this.position = this.position.add(overlap);

    this.velocity = hit
      ? reflect(this.velocity.multiply(0.9), overlap.normalize())
      : this.velocity.add(Fruit.G);

    this.velocity = this.velocity.max(this.terminalVelocity);
  }

  boundaryOverlap(boundaries) {
    const overlap = boundaries.reduce(
      (acc, boundary) =>
        acc.add(calculateOverlap(this.boundingBox, boundary.points)),
      new Vector(0, 0)
    );
    const hit = overlap.x !== 0 || overlap.y !== 0;
    return { hit, overlap };
  }

  wrapAround() {
    const p = this.position;
    p.y = p.y > height ? -this.size : p.y;
    p.x = p.x > width ? 0 : p.x < 0 ? width : p.x;
  }

  draw() {
    this.drawStrategy.draw(this);
  }
  get mass() {
    return this.size * this.size;
  }
  get terminalVelocity() {
    return this.mass;
  }
}
