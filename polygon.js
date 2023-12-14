class Polygon {
  constructor(...points) {
    this.points = points;
  }

  get centerPoint() {
    if (!this._centerPoint) {
      let sum = this.points.reduce((acc, point) => {
        return acc.add(point);
      }, new Vector(0, 0));

      this._centerPoint = sum.divide(this.points.length);
    }
    return this._centerPoint;
  }

  add(vector) {
    return new Polygon(...this.points.map((p) => p.add(vector)));
  }

  subtract(vector) {
    return new Polygon(...this.points.map((p) => p.subtract(vector)));
  }

  at(vector) {
    return this.add(vector);
  }

  atFast(vector) {
    return this.points.map((p) => p.add(vector));
  }

  //find minimum circle to contain the polygon
  get boundingRadius() {
    if (!this.boundingRadius_) {
      let center = this.centerPoint;
      let radius = 0;
      for (let point of this.points) {
        let distance = point.distance(center);
        if (distance > radius) radius = distance;
      }
      this.boundingRadius_ = radius;
    }

    return this.boundingRadius_;
  }

  calculateOverlap(polygonB) {
    let minimumOverlap = Infinity;
    let smallestAxis = null;
    let allAxes = [...this.axes, ...polygonB.axes];

    for (let axis of allAxes) {
      let { min: minA, max: maxA } = this.project(axis);
      let { min: minB, max: maxB } = polygonB.project(axis);

      let overlap = Math.min(maxA, maxB) - Math.max(minA, minB);

      if (overlap <= 0) return new Vector(0, 0);
      if (overlap < minimumOverlap) {
        minimumOverlap = overlap;
        smallestAxis = axis;
      }
    }

    let d = polygonB.centerPoint.subtract(this.centerPoint);
    if (d.dot(smallestAxis) < 0) smallestAxis = smallestAxis.multiply(-1);

    return smallestAxis.multiply(minimumOverlap);
  }

  get axes() {
    if (!this.axes_) {
      let axes = [];
      for (let i = 0; i < this.points.length; i++) {
        let p1 = this.points[i];
        let p2 = this.points[i + 1 === this.points.length ? 0 : i + 1];
        let edge = p2.subtract(p1);
        let normal = new Vector(-edge.y, edge.x);
        normal = normal.normalize();

        axes.push(normal);
      }
      this.axes_ = axes;
    }
    return this.axes_;
  }

  project(axis) {
    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < this.points.length; i++) {
      let vertex = this.points[i];
      let projection = axis.dot(vertex);

      min = Math.min(min, projection);
      max = Math.max(max, projection);
    }

    return { min, max };
  }

  getCenterOfEachEdge() {
    if (!this.centersOfEachEdge) {
      let centers = [];
      for (let i = 0; i < this.points.length; i++) {
        let p1 = this.points[i];
        let p2 = this.points[(i + 1) % this.points.length];
        let center = new Vector((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        centers.push(center);
      }
      this.centersOfEachEdge = centers;
    }
    return this.centersOfEachEdge;
  }

  // Both the circle and rectangle method should probably return a Polygon
  static generateCircle(centerX, centerY, radius, points = 5) {
    let boundingBox = [];
    for (let i = 0; i < points; i++) {
      let angle = (i / points) * Math.PI * 2;
      let x = centerX + radius * Math.cos(angle);
      let y = centerY + radius * Math.sin(angle);
      boundingBox.push(new Vector(x, y));
    }
    return boundingBox;
  }

  static generateRectangle(centerX, centerY, width, height) {
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
}
