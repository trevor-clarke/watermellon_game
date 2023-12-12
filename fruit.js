class Fruit extends Entity {
  static G = new Vector(0, 0.1);

  constructor(x, y) {
    super(x, y);
    this.color = "red";
  }

  update(boundaries, fruit) {
    this.position.add_(this.velocity);
    this.wrapAround();

    this.velocity.add_(Fruit.G);
    let [isHit, overlap] = this.boundaryOverlap(boundaries);

    if (isHit) {
      this.position.subtract_(overlap);
      this.arrow(overlap.multiply(-10), "purple").draw();
      this.velocity = reflect(
        this.velocity.multiply_(0.9),
        overlap.normalize()
      );
      this.reduceVelocity(new Vector(0.1, 0.4));
    } else {
    }

    this.velocity.max_(this.terminalVelocity);
  }

  arrow(endpoint, color) {
    return new Arrow(color, this.position, this.position.add(endpoint));
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
