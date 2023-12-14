class Fruit extends Entity {
  static restitution = 0.7;
  static boundaryRestitution = 0.7;

  get hitbox() {
    return this.polygon.at(this.position);
  }

  get mass() {
    return (this.size * this.size) / 200;
  }

  get terminalVelocity() {
    return 40;
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

  calculateOverlapWithObjects(allObjects) {
    // const subset = closestObjects(allObjects);
    let objectsOverlap = [];
    for (let i = 0; i < 3; i++) {
      let currentOverlap = new Vector(0, 0);
      allObjects.forEach((object) => {
        if (!this.isCloseEnoughTo(object)) return;
        const overlap = this.hitbox.calculateOverlap(object.hitbox);
        if (overlap.magnitude() > 0.1) {
          objectsOverlap.push([object, overlap]);
          currentOverlap = currentOverlap.add(overlap);
        }
      });
      if (currentOverlap.magnitude() <= 0.1) break;
      this.position.subtract_(currentOverlap);
    }
    return objectsOverlap;
  }

  isCloseEnoughTo(object) {
    const a = this.polygon.boundingRadius;
    const b = object.polygon.boundingRadius;

    const c = this.position.distance(object.position);
    return c < a + b;
  }

  handleCollisions(objectsOverlap, totalDisplacement) {
    for (let [object, overlap] of objectsOverlap) {
      const displacementProportion =
        overlap.magnitude() / totalDisplacement.magnitude();
      if (object instanceof Boundary) {
        this.handleBoundaryCollision(overlap, displacementProportion);
      } else if (object instanceof Fruit) {
        this.handleFruitCollision(object, displacementProportion);
      }
    }
  }

  handleBoundaryCollision(overlap, displacementProportion) {
    const normal = overlap.normalize();
    this.velocity = Physics.reflectAndScaleVelocity(
      this.velocity,
      normal,
      Fruit.boundaryRestitution * displacementProportion
    );
  }

  handleFruitCollision(object, displacementProportion) {
    const normal = this.position.subtract(object.position).normalize();
    const { v1, v2 } = Physics.calculateImpulseAndVelocity(
      this.velocity,
      object.velocity,
      this.mass,
      object.mass,
      normal,
      displacementProportion * Fruit.restitution
    );
    this.velocity = v1;
    object.velocity = v2;
  }

  update(boundaries, fruit) {
    this.velocity = this.velocity.add(Physics.gravity);
    this.wrapAround(0.5);
    this.position.add_(this.velocity);
    let originalPosition = this.position.dup;

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

  wrapAround(energyLoss) {
    const originalPosition = this.position.dup;
    const p = this.position;
    p.y = p.y > height ? -this.size : p.y;
    p.x = p.x > width ? 0 : p.x < 0 ? width : p.x;

    if (p.x !== originalPosition.x) {
      this.velocity.x *= energyLoss;
    }
    if (p.y !== originalPosition.y) {
      this.velocity.y *= energyLoss;
    }
  }
}
