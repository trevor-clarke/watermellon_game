class Fruit extends Entity {
  static G = new Vector(0, 0.1);

  constructor(x, y) {
    super(x, y);
    this.color = "red";
  }

  update(boundaries, fruit) {
    this.position.add_(this.velocity);
    this.wrapAround();

    let [isHit, overlap] = this.boundaryOverlap(boundaries);
    // round to number of digits

    if (isHit) {
      const ah = this.boundaryOverlapAsArrayOfOverlaps(boundaries).map((o) => [
        o.x.toFixed(2),
        o.y.toFixed(2),
      ]);
      text(JSON.stringify(), this.x + this.size, this.y);
      this.position.subtract_(overlap);

      new Arrow(
        "blue",
        this.position,
        this.position.subtract(overlap.multiply(10))
      ).draw();
      this.velocity = reflect(
        this.velocity.multiply_(0.99),
        overlap.normalize()
      );
      this.reduceVelocity(new Vector(0.1, 0.3));
    } else {
      this.velocity.add_(Fruit.G);
    }

    this.velocity.max_(this.terminalVelocity);
  }

  boundaryOverlap(boundaries) {
    const overlap = boundaries.reduce(
      (acc, boundary) =>
        acc.add_(calculateOverlap(this.boundingBox, boundary.points)),
      new Vector(0, 0)
    );
    const hit = overlap.x !== 0 || overlap.y !== 0;
    return [hit, overlap];
  }

  boundaryOverlapAsArrayOfOverlaps(boundaries) {
    return boundaries.map((boundary) =>
      calculateOverlap(this.boundingBox, boundary.points)
    );
  }

  wrapAround() {
    const p = this.position;
    p.y = p.y > height ? -this.size : p.y;
    p.x = p.x > width ? 0 : p.x < 0 ? width : p.x;
  }

  reduceVelocity(smallAmount) {
    const smallX = smallAmount.x;
    const smallY = smallAmount.y;
    this.velocity.x =
      Math.abs(this.velocity.x) < smallX * 3
        ? 0
        : this.velocity.x > 0
        ? this.velocity.x - smallX
        : this.velocity.x + smallX;
    this.velocity.y =
      Math.abs(this.velocity.y) < smallY * 3
        ? 0
        : this.velocity.y > 0
        ? this.velocity.y - smallY
        : this.velocity.y + smallY;
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
