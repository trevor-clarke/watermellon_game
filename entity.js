class Entity {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  updatePosition(G) {}

  draw() {
    throw new Error("draw method not implemented");
  }

  get mass() {
    throw new Error("mass property not implemented");
  }

  update() {
    throw new Error("update method not implemented");
  }
}

function projectPolygon(axis, polygon) {
  let min = Infinity;
  let max = -Infinity;
  for (const point of polygon) {
    let dotProduct = point.x * axis.x + point.y * axis.y;
    if (dotProduct < min) min = dotProduct;
    if (dotProduct > max) max = dotProduct;
  }
  return { min, max };
}

function getAxes(polygon) {
  let axes = [];
  for (let i = 0; i < polygon.length; i++) {
    let p1 = polygon[i];
    let p2 = polygon[(i + 1) % polygon.length];
    let edge = new Vector(p2.x - p1.x, p2.y - p1.y);
    let normal = new Vector(-edge.y, edge.x).normalize();
    axes.push(normal);
  }

  return axes;
}

function calculateOverlap(polygonA, polygonB) {
  let minimumOverlap = Infinity;
  let smallestAxis = null;
  let allAxes = [...getAxes(polygonA), ...getAxes(polygonB)];

  for (let axis of allAxes) {
    let projectionA = projectPolygon(axis, polygonA);
    let projectionB = projectPolygon(axis, polygonB);

    let overlap =
      Math.min(projectionA.max, projectionB.max) -
      Math.max(projectionA.min, projectionB.min);

    if (overlap <= 0) {
      return new Vector(0, 0);
    } else if (overlap < minimumOverlap) {
      minimumOverlap = overlap;
      smallestAxis = axis;
    }
  }

  let mtvDirection = new Vector(smallestAxis.x, smallestAxis.y).normalize();
  return mtvDirection.multiply(minimumOverlap);
}

function reflect(vel, normal) {
  // Ensure the normal is a unit vector
  normal = normal.normalize();

  // Calculate the reflection using the formula R = V - 2*(V·N)*N
  const dotProduct = vel.dot(normal);
  return vel.subtract(normal.multiply(2 * dotProduct));
}

function getRectangularBoundingBox(centerX, centerY, width, height) {
  return [
    {
      x: centerX - width / 2,
      y: centerY - height / 2,
    },
    {
      x: centerX + width / 2,
      y: centerY - height / 2,
    },
    {
      x: centerX + width / 2,
      y: centerY + height / 2,
    },
    {
      x: centerX - width / 2,
      y: centerY + height / 2,
    },
  ];
}

function getCircularBoundingBox(centerX, centerY, radius) {
  // approximate circle with 25 points

  let boundingBox = [];
  for (let i = 0; i < 20; i++) {
    let angle = (i / 20) * Math.PI * 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    boundingBox.push(new Vector(x, y));
  }
  return boundingBox;
}

function drawPolygon(polygon) {
  box = polygon;
  push();
  strokeWeight(1);
  stroke("green");
  for (let i = 0; i < box.length; i++) {
    line(
      box[i].x,
      box[i].y,
      box[(i + 1) % box.length].x,
      box[(i + 1) % box.length].y
    );
  }
  pop();
}
