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
}
