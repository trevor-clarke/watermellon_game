class Fruit extends Entity {
  static restitution = 0.9;
  static boundaryRestitution = 0.9;

  constructor(x, y) {
    super(x, y);
    this.externalForce = [];
  }
  get hitbox() {
    return this.polygon.at(this.position);
  }

  get terminalVelocity() {
    return 60;
  }

  draw() {
    push();
    fill(this.color);
    beginShape();
    this.polygon.at(this.position).points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);
    // fill(255);
    // textSize(12);
    // textAlign(CENTER, CENTER);
    // text(this.mass.toFixed(0), this.x, this.y);
    pop();
  }

  calculateOverlapWithObjects(allObjects) {
    let objectsOverlap = [];
    for (let i = 0; i < 6; i++) {
      let currentOverlap = new Vector(0, 0);
      allObjects.forEach((object) => {
        if (!this.isCloseEnoughTo(object)) return;
        const overlap = this.hitbox.calculateOverlap(object.hitbox);
        if (overlap.magnitude() > 0) {
          objectsOverlap.push([object, overlap]);
          currentOverlap = currentOverlap.add(overlap);
        }
      });
      if (currentOverlap.magnitude() <= 0.15) break;
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
    const totalDisplacementMagnitude = totalDisplacement.magnitude();
    for (let [object, overlap] of objectsOverlap) {
      const displacementProportion =
        overlap.magnitude() / totalDisplacementMagnitude;
      if (object instanceof Boundary) {
        this.handleBoundaryCollision(overlap, displacementProportion);
      } else if (object instanceof Fruit) {
        this.handleFruitCollision(object, displacementProportion);
        object.velocity.min_(0.5);
      }
    }
    this.velocity.min_(0.5);
  }

  handleBoundaryCollision(overlap, displacementProportion) {
    this.velocity = Physics.reflectAndScaleVelocity(
      this.velocity,
      overlap.normalize(),
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

  update(objects) {
    this.velocity = this.velocity.add(Physics.gravity);
    this.externalForce.forEach((f) => this.velocity.add_(f));
    this.externalForce = [];
    this.wrapAround(0.5);
    this.velocity.max_(this.terminalVelocity);
    this.position.add_(this.velocity);
    let originalPosition = this.position.dup;

    const objectsOverlap = this.calculateOverlapWithObjects(
      objects.filter((o) => o !== this)
    );

    const displacement = this.position.subtract(originalPosition);

    if (displacement.magnitude() < 0.01) return;
    const totalDisplacement = objectsOverlap.reduce(
      (acc, [_, overlap]) => acc.add(overlap),
      new Vector(0, 0)
    );
    this.handleCollisions(objectsOverlap, totalDisplacement);
    // this.arrow(this.velocity.multiply(10), "blue", "");
  }

  calcAirResistance() {
    const speed = this.velocity.magnitude();
    const drag = this.velocity
      .multiply(-1)
      .normalize()
      .multiply(speed * speed);
    return drag.multiply(0.0005 * (this.mass / 14));
  }

  arrow(endpoint, color, t) {
    new Arrow(color, this.position, this.position.add(endpoint)).draw();
    const textPos = this.position.add(endpoint);
    text(t, textPos.x, textPos.y);
  }

  wrapAround(energyLoss) {
    const p = this.position;
    p.y = p.y > height ? -this.size : p.y;
    p.x = p.x > width ? 0 : p.x < 0 ? width : p.x;

    this.velocity.max_(this.terminalVelocity / 3);
  }
}
