class Boundary {
  constructor(...points) {
    this.points = points;
    this.polygon = new Polygon(...points);
  }

  update(objects) {}

  get hitbox() {
    return this.polygon;
  }

  get position() {
    return this.polygon.centerPoint;
  }

  draw() {
    fill(220, 200, 200);
    noStroke();
    beginShape();
    this.points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);

    // const axes = this.polygon.axes;
    // const centers = this.polygon.getCenterOfEachEdge();
    // axes.forEach((axis, i) => {
    //   const center = centers[i];
    //   const arrow = new Arrow("blue", center, center.add(axis.multiply(10)));
    //   arrow.draw();
    // });
  }
}
