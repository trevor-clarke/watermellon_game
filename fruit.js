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
      this.color = "red";
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
        ).multiply(0.5);
      }
    }

    // Check for collision with other fruit
    fruit.forEach((otherFruit) => {
      if (otherFruit === this) return;
      const overlap = calculateOverlap(
        this.boundingBox,
        otherFruit.boundingBox
      );
      if (overlap.magnitude() > 0.1) {
        otherFruit.atRest = false;
        this.position = this.position.add(overlap);

        // Calculate final velocities
        const { v1Final, v2Final } = calculateFinalVelocities(
          this.mass,
          otherFruit.mass,
          this.velocity,
          otherFruit.velocity,
          0.2
        );

        // Update velocities
        this.velocity = v1Final;
        otherFruit.velocity = v2Final;
      }
    });

    // Update velocity or set at rest
    if (this.atRest || hittingABoundary) {
      if (this.velocity.magnitude() < 0.2) {
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

function calculateFinalVelocities(
  m1,
  m2,
  v1Initial,
  v2Initial,
  coefficientOfRestitution
) {
  // Using the conservation of momentum (Vector operation)
  const totalInitialMomentum = v1Initial
    .multiply(m1)
    .add(v2Initial.multiply(m2));

  // Relative velocity before collision (Vector operation)
  const relativeVelocityInitial = v2Initial.subtract(v1Initial);

  // Using the coefficient of restitution to calculate relative velocity after collision
  const relativeVelocityFinal = relativeVelocityInitial.multiply(
    coefficientOfRestitution
  );

  // Calculate final velocities
  const v1Final = totalInitialMomentum
    .subtract(v2Initial.multiply(m2))
    .add(relativeVelocityFinal.multiply(m2))
    .divide(m1 + m2);
  const v2Final = relativeVelocityFinal.add(v1Final);

  return { v1Final, v2Final };
}
