class Fruit extends Entity {
  static restitution = 0.8;
  static boundaryRestitution = 0.5;

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
    pop();
  }

  calculateOverlapWithObjects(allObjects) {
    let objectsOverlap = new Map();

    for (let i = 0; i < 7; i++) {
      let currentOverlap = allObjects.reduce((accumulatedOverlap, object) => {
        if (!this.isCloseEnoughTo(object)) return accumulatedOverlap;

        const overlap = this.hitbox.calculateOverlap(object.hitbox);
        if (overlap.magnitude() > 0) {
          objectsOverlap.set(
            object,
            (objectsOverlap.get(object) || new Vector(0, 0)).add(overlap)
          );
          this.position.subtract_(overlap);
          return accumulatedOverlap.add(overlap);
        }
        return accumulatedOverlap;
      }, new Vector(0, 0));

      if (currentOverlap.magnitude() <= 0.2) break;
    }

    return objectsOverlap;
  }

  isCloseEnoughTo(object) {
    const a = this.polygon.boundingRadius;
    const b = object.polygon.boundingRadius;

    const c = this.position.distance(object.position);
    return c < a + b;
  }

  handleCollisions(objectsOverlap, distanceMoved) {
    for (let [object, overlap] of objectsOverlap) {
      const displacementProportion = overlap.magnitude() / distanceMoved;
      if (object instanceof Boundary) {
        this.handleBoundaryCollision(overlap, displacementProportion);
      } else if (object instanceof Fruit) {
        this.handleFruitCollision(object, displacementProportion);
        object.velocity.min_(0.5);
      }
    }
    this.velocity.min_(0.5);
  }

  handleCollisionWithObject(object, overlap, distanceMoved) {
    const displacementProportion = overlap.magnitude() / distanceMoved;

    if (object instanceof Boundary) {
      this.handleBoundaryCollision(overlap, displacementProportion);
    } else if (object instanceof Fruit) {
      this.handleFruitCollision(object, displacementProportion);
      object.velocity.min_(0.5);
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
    this.velocity.max_(this.terminalVelocity);
    this.wrapAround(0.5);
    this.position.add_(this.velocity);
    let originalPosition = this.position.dup;

    const filtered = objects.filter((o) => o !== this);

    const objectsOverlap = this.calculateOverlapWithObjects(filtered);

    // If there's no significant movement, return early
    const distanceMoved = originalPosition.subtract(this.position).magnitude();
    if (distanceMoved < 0.01) return;

    // Iterate through each object and its overlap in the map
    objectsOverlap.forEach((overlap, object) => {
      // Handle each collision based on the object and its cumulative overlap
      this.handleCollisionWithObject(object, overlap, distanceMoved);
    });

    this.arrow(this.velocity.multiply(10), "blue", "");
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
