class Fruit extends Entity {
  static G = new Vector(0, 9.81 / 31);
  static restitution = 0.9;

  draw() {
    push();
    fill(this.color);
    beginShape();
    this.polygon.at(this.position).points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);
    pop();

    // display the mass in white text in the center of the fruit
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(this.mass.toFixed(0), this.x, this.y);
  }

  // Update the position and velocity of the object
  updatePositionAndVelocity() {
    this.velocity = this.velocity.add(Fruit.G);
    this.wrapAround();
    this.position.add_(this.velocity);
  }

  // Calculate the overlap between objects
  calculateOverlapWithObjects(allObjects) {
    let currentOverlap;
    let objectsOverlap = [];

    for (let i = 0; i < 5; i++) {
      currentOverlap = allObjects.reduce((acc, object) => {
        const overlap = calculateOverlap(
          this.polygon.at(this.position).points,
          object.points
        );
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

  // Calculate the total displacement
  calculateTotalDisplacement(objectsOverlap) {
    let totalDisplacement = new Vector(0, 0);

    for (let [object, overlap] of objectsOverlap) {
      totalDisplacement = totalDisplacement.add(overlap);
    }

    return totalDisplacement;
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

    const totalDisplacement = this.calculateTotalDisplacement(objectsOverlap);

    this.handleCollisions(objectsOverlap, totalDisplacement);
  }

  get points() {
    return this.polygon.at(this.position).points;
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

function perfectlyElasticCollision(v1, m1, v2, m2) {
  const v1f = v1
    .multiply(m1 - m2)
    .add(v2.multiply(2 * m2))
    .divide(m1 + m2);

  const v2f = v2
    .multiply(m2 - m1)
    .add(v1.multiply(2 * m1))
    .divide(m1 + m2);

  return { v1: v1f, v2: v2f };
}

function calculateOverlap(polygonA, polygonB) {
  let minimumOverlap = Infinity;
  let smallestAxis = null;
  let allAxes = [...getAxes(polygonA), ...getAxes(polygonB)];

  for (let axis of allAxes) {
    let { min: minA, max: maxA } = projectPolygon(axis, polygonA);
    let { min: minB, max: maxB } = projectPolygon(axis, polygonB);

    let overlap = Math.min(maxA, maxB) - Math.max(minA, minB);

    if (overlap <= 0) return new Vector(0, 0);
    if (overlap < minimumOverlap) {
      minimumOverlap = overlap;
      smallestAxis = axis;
    }
  }

  let d = calculateCenter(polygonB).subtract(calculateCenter(polygonA));
  if (d.dot(smallestAxis) < 0) smallestAxis = smallestAxis.multiply(-1);

  return smallestAxis.multiply(minimumOverlap);
}

function projectPolygon(axis, polygon) {
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < polygon.length; i++) {
    let vertex = polygon[i];
    let projection = axis.dot(vertex); // Take the dot product of the axis and vertex

    min = Math.min(min, projection);
    max = Math.max(max, projection);
  }

  return { min, max };
}

function getAxes(polygon) {
  let axes = [];

  for (let i = 0; i < polygon.length; i++) {
    // Get the current vertex and the next vertex (or the first vertex if the current vertex is the last)
    let p1 = polygon[i];
    let p2 = polygon[i + 1 === polygon.length ? 0 : i + 1];

    // Calculate the edge vector
    let edge = p2.subtract(p1);

    // Calculate the normal to the edge (which is a perpendicular vector)
    let normal = new Vector(-edge.y, edge.x);

    // Normalize the normal
    normal = normal.normalize();

    axes.push(normal);
  }

  return axes;
}
