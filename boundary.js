class Boundary {
  constructor(...points) {
    this.points = points;
    this.polygon = new Polygon(...points);
  }

  get hitbox() {
    return this.polygon;
  }

  draw() {
    fill(220, 200, 200);
    noStroke();
    beginShape();
    this.points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);

    const axes = this.polygon.axes;
    const centers = this.polygon.getCenterOfEachEdge();
    axes.forEach((axis, i) => {
      const center = centers[i];
      const arrow = new Arrow("red", center, center.add(axis.multiply(20)));
      arrow.draw();
    });
  }
}
