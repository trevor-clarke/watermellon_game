class Fruit extends Entity {
  static G = new Vector(0, 0.5); // Or any value less than the original

  static random(x, y) {
    const type = Fruit.types[Math.floor(Math.random() * Fruit.types.length)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
    this.atRest = false;
  }
  update(boundaries, fruit) {
    // Update position if not at rest
    if (!this.atRest) {
      this.position = this.position.add(
        this.velocity.max(this.terminalVelocity)
      );
    } else {
      this.color = "green";
    }

    // Check for collision and calculate accumulated overlap
    let accumulatedOverlap = new Vector(0, 0);

    let hittingABoundary = boundaries.some((boundary) => {
      const overlap = calculateOverlap(this.boundingBox, boundary.points);
      if (overlap.magnitude() > 0.1) {
        accumulatedOverlap = accumulatedOverlap.add(overlap);
        return true; // On ground if overlap is significant
      }
    });

    // Collision response and update atRest status
    if (accumulatedOverlap.magnitude() > 0.3) {
      this.position = this.position.add(accumulatedOverlap);
      if (!this.atRest) {
        this.velocity = reflect(
          this.velocity,
          accumulatedOverlap.normalize()
        ).multiply(0.7);
      }
    }

    // Update velocity or set at rest
    if (this.atRest || hittingABoundary) {
      if (this.velocity.magnitude() < 0.35) {
        this.atRest = true;
        this.velocity = new Vector(0, 0);
      }
    } else {
      this.velocity = this.velocity.add(Fruit.G);
    }
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
