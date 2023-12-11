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

function axisOverlap(axis, polygonA, polygonB) {
  let projectionA = projectPolygon(axis, polygonA);
  let projectionB = projectPolygon(axis, polygonB);

  return (
    projectionA.max >= projectionB.min && projectionB.max >= projectionA.min
  );
}

function getEdges(polygon) {
  let edges = [];
  for (let i = 0; i < polygon.length; i++) {
    let start = polygon[i];
    let end = polygon[(i + 1) % polygon.length];
    let edge = {
      x: end.x - start.x,
      y: end.y - start.y,
    };
    let perpendicular = { x: -edge.y, y: edge.x };
    edges.push(perpendicular);
  }
  return edges;
}

function polygonsCollide(polygonA, polygonB) {
  let edgesA = getEdges(polygonA);
  let edgesB = getEdges(polygonB);

  for (const edge of edgesA) {
    if (!axisOverlap(edge, polygonA, polygonB)) return false;
  }

  for (const edge of edgesB) {
    if (!axisOverlap(edge, polygonA, polygonB)) return false;
  }

  return true;
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
  let minimumOverlap = 500;
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

function reflect(velocity, normal, mass1, mass2) {
  // debugger;
  let dotProduct = velocity.dot(normal);
  let massFactor = (2 * mass1) / (mass1 + mass2);
  return velocity.subtract(normal.multiply(massFactor * dotProduct));
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
  for (let i = 0; i < 25; i++) {
    let angle = (i / 25) * Math.PI * 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    boundingBox.push({ x, y });
  }
  return boundingBox;
}
