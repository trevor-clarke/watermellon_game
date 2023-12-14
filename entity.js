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

function getCenterOfEachEdge(polygon) {
  let centers = [];
  for (let i = 0; i < polygon.length; i++) {
    let p1 = polygon[i];
    let p2 = polygon[(i + 1) % polygon.length];
    let center = new Vector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
    centers.push(center);
  }

  return centers;
}

function calculateCenter(polygon) {
  let sum = polygon.reduce((acc, point) => {
    return acc.add(point);
  }, new Vector(0, 0));

  return sum.divide(polygon.length);
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

function getCircularBoundingBox(centerX, centerY, radius, points = 30) {
  let boundingBox = [];
  for (let i = 0; i < points; i++) {
    let angle = (i / points) * Math.PI * 2;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    boundingBox.push(new Vector(x, y));
  }
  return boundingBox;
}
