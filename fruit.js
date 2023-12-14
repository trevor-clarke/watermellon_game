class Fruit extends Entity {
  static restitution = 0.9;

  get hitbox() {
    return this.polygon.at(this.position);
  }

  draw() {
    push();
    fill(this.color);
    beginShape();
    this.polygon.at(this.position).points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);
    pop();

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.mass.toFixed(0), this.x, this.y);
  }

  // Update the position and velocity of the object
  updatePositionAndVelocity() {
    this.velocity = this.velocity.add(Physics.gravity);
    this.wrapAround();
    this.position.add_(this.velocity);
  }

  // Calculate the overlap between objects
  calculateOverlapWithObjects(allObjects) {
    let currentOverlap;
    let objectsOverlap = [];

    for (let i = 0; i < 5; i++) {
      currentOverlap = allObjects.reduce((acc, object) => {
        const overlap = this.hitbox.calculateOverlap(object.hitbox);
        if (overlap.magnitude() > 0.1) {
          objectsOverlap.push([object, overlap]);
        }
        return acc.add(overlap);
      }, new Vector(0, 0));

      if (currentOverlap.magnitude() <= 0.1) break;

      this.position.subtract_(currentOverlap);
      i++;
    }

    return objectsOverlap;
  }

  // Handle collisions with other objects
  handleCollisions(objectsOverlap, totalDisplacement) {
    for (let [object, overlap] of objectsOverlap) {
      const displacementProportion =
        overlap.magnitude() / totalDisplacement.magnitude();

      if (object instanceof Boundary) {
        this.handleBoundaryCollision(overlap, displacementProportion);
      } else if (object instanceof Fruit) {
        this.handleFruitCollision(object, overlap, displacementProportion);
      }
    }
  }

  // Handle collisions with boundaries
  handleBoundaryCollision(overlap, displacementProportion) {
    const normal = overlap.normalize();
    this.velocity = this.velocity
      .reflect(normal)
      .multiply(0.9 * displacementProportion);
  }

  // Handle collisions with fruits
  handleFruitCollision(object, overlap, displacementProportion) {
    const relativeVelocity = this.velocity.subtract(object.velocity);
    const normal = this.position.subtract(object.position).normalize();
    const velocityAlongNormal = relativeVelocity.dot(normal);

    if (velocityAlongNormal > 0) return;

    const impulse =
      (2 * velocityAlongNormal * displacementProportion) /
      (this.mass + object.mass);
    this.velocity = this.velocity.subtract(
      normal.multiply(impulse * object.mass)
    );
    object.velocity = object.velocity.add(normal.multiply(impulse * this.mass));
  }

  // The main update function
  update(boundaries, fruit) {
    this.updatePositionAndVelocity();
    let originalPosition = this.position.dup;

    //TOD: Pass these in and remove itself at the beginning
    const allObjects = [...boundaries, ...fruit.filter((f) => f !== this)];

    const objectsOverlap = this.calculateOverlapWithObjects(allObjects);

    const displacement = this.position.subtract(originalPosition);
    if (displacement.magnitude() < 0.1) return;

    const totalDisplacement = objectsOverlap.reduce(
      (acc, [_, overlap]) => acc.add(overlap),
      new Vector(0, 0)
    );

    this.handleCollisions(objectsOverlap, totalDisplacement);
  }

  arrow(endpoint, color, t) {
    new Arrow(color, this.position, this.position.add(endpoint)).draw();
    const textPos = this.position.add(endpoint);
    text(t, textPos.x, textPos.y);
  }

  wrapAround() {
    const p = this.position;
    p.y = p.y > height ? -this.size : p.y;
    p.x = p.x > width ? 0 : p.x < 0 ? width : p.x;
  }

  get mass() {
    return (this.size * this.size) / 100;
  }
  get terminalVelocity() {
    return 40;
  }
}
