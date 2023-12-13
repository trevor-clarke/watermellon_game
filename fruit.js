class Fruit extends Entity {
  static G = new Vector(0, 9.8 / 10);

  constructor(x, y) {
    super(x, y);
    this.color = "red";
  }

  update(boundaries, fruit) {
    this.position.add_(this.velocity);
    this.wrapAround();

    this.arrow(this.velocity, "green", "velocity");

    const news = new Vector(0, 0);
    news.add_(Fruit.G);
    this.arrow(Fruit.G, "green", "gravity");

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      let [isHit, overlap] = this.boundaryOverlap([boundary]);
      this.position.subtract_(overlap);

      if (isHit) {
        const normal = overlap.negate().normalize();
        const newsNormal = news.dot(normal);
        const frictionDirection = this.velocity.negate().normalize();
        const friction = frictionDirection.multiply(newsNormal);
        friction.multiply_(boundary.friction);
        news.subtract_(friction);

        this.arrow(friction.negate(), "blue", "friction");
        this.arrow(
          normal,
          "blue",
          "normal" + overlap.negate().normalize().magnitude()
        );
        this.arrow(news, "green", "velocity");
        // calc friction force on fruit from boundary

        this.velocity = reflect(
          this.velocity.multiply_(0.9),
          overlap.normalize()
        );

        this.reduceVelocity(new Vector(0.1, 0.1));
      }
    }

    this.velocity.add_(news);

    // this.reduceVelocity(new Vector(0.2, 0.2));

    // this.velocity.max_(this.terminalVelocity);
  }

  get points() {
    return this.boundingBox;
  }

  arrow(endpoint, color, label = "") {
    const arrowEnd = this.position.add(endpoint.multiply(50));
    new Arrow(color, this.position, arrowEnd).draw();
    //draw the label halfway between the fruit and the arrow

    push();
    fill(color);
    text(label, arrowEnd.x + 5, arrowEnd.y);
    pop();
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

  fruitOverlap(boundaries) {
    const overlap = boundaries.reduce(
      (acc, boundary) => acc.add_(calculateOverlap(this.boundingBox, boundary)),
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
    return this.size * 2;
  }
  get terminalVelocity() {
    return this.mass;
  }
}

function perfectlyElasticCollision(v1, m1, v2, m2) {
  // Calculate the new velocity of the first object after the collision
  let v1f = v1
    .multiply(m1 - m2)
    .add(v2.multiply(2 * m2))
    .divide(m1 + m2);

  // Calculate the new velocity of the second object after the collision
  let v2f = v2
    .multiply(m2 - m1)
    .add(v1.multiply(2 * m1))
    .divide(m1 + m2);

  // Return the new velocities
  return { v1: v1f, v2: v2f };
}
